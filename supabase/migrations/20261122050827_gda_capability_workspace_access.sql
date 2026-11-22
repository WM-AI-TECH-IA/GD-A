/*
# Capability-scoped workspace access
1. Purpose
Enable the existing no-account application to access its private workspace using the provisioned anonymous client. Direct table access remains denied. A random 256-bit browser capability is hashed inside PostgreSQL; only its holder can read or mutate the corresponding workspace. This is capability access, not account authentication.
2. Function
Adds gda_workspace_operation(token,action,data), a narrow RPC for conversations, approved memories, selected documents, passages, atomic indexing and request budgeting. It validates all inputs, derives workspace internally, and never accepts a caller-supplied owner hash. No arbitrary SQL or table identifier is accepted.
3. Security
SECURITY DEFINER with pg_catalog-first fixed search_path including pg_temp; all relations qualified. PUBLIC execution revoked; anon/authenticated/service_role may execute this intentionally public capability RPC. Tables retain deny policies and no anon/authenticated grants. The bearer token is not returned or stored in plaintext. Hourly model/index/search budget is 30 per capability and 200 globally.
4. Preservation
No existing rows or archive files are changed. Delete operations affect only explicitly selected approved memories or imported indexes belonging to the capability holder.
*/
CREATE OR REPLACE FUNCTION public.gda_workspace_operation(p_token text,p_action text,p_data jsonb DEFAULT '{}'::jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public,pg_temp AS $$
DECLARE w text; r jsonb; n integer; d uuid; content text; off integer; lim integer;
BEGIN
IF p_token IS NULL OR p_token !~ '^[a-f0-9]{64}$' OR octet_length(p_data::text)>150000 THEN RAISE EXCEPTION 'Invalid request'; END IF;
w:=encode(sha256(convert_to(p_token,'UTF8')),'hex');
IF p_action='budget' THEN
IF NOT public.gda_claim_request(w) THEN RETURN 'false'::jsonb; END IF;
INSERT INTO public.gda_request_windows(workspace,window_start,requests) VALUES('__global__',now(),1) ON CONFLICT(workspace) DO UPDATE SET requests=CASE WHEN gda_request_windows.window_start<now()-interval '1 hour' THEN 1 ELSE gda_request_windows.requests+1 END,window_start=CASE WHEN gda_request_windows.window_start<now()-interval '1 hour' THEN now() ELSE gda_request_windows.window_start END RETURNING requests INTO n;
RETURN to_jsonb(n<=200);
ELSIF p_action='gda_chat_turns.select' THEN
off:=greatest(0,least(coalesce((p_data->>'offset')::integer,0),1000000)); lim:=greatest(1,least(coalesce((p_data->>'limit')::integer,30),500));
SELECT coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) INTO r FROM (SELECT id,question,answer,sources,created_at FROM public.gda_chat_turns WHERE workspace=w ORDER BY CASE WHEN p_data->>'ascending'='true' THEN created_at END ASC,created_at DESC,id LIMIT lim OFFSET off) t; RETURN r;
ELSIF p_action='gda_chat_turns.insert' THEN
IF length(p_data->>'question') NOT BETWEEN 1 AND 4000 OR length(p_data->>'answer') NOT BETWEEN 1 AND 40000 OR jsonb_typeof(p_data->'sources')<>'array' THEN RAISE EXCEPTION 'Invalid turn'; END IF;
INSERT INTO public.gda_chat_turns(workspace,question,answer,sources) VALUES(w,p_data->>'question',p_data->>'answer',p_data->'sources'); RETURN '[]'::jsonb;
ELSIF p_action='gda_approved_memories.select' THEN
SELECT coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) INTO r FROM (SELECT id,content,created_at FROM public.gda_approved_memories WHERE workspace=w ORDER BY created_at DESC LIMIT 100) t; RETURN r;
ELSIF p_action IN ('gda_approved_memories.insert','gda_approved_memories.update') THEN
content:=p_data->>'content'; IF content IS NULL OR length(content) NOT BETWEEN 1 AND 4000 THEN RAISE EXCEPTION 'Invalid memory'; END IF;
IF p_action='gda_approved_memories.insert' THEN
PERFORM pg_advisory_xact_lock(hashtextextended(w,0));
IF (SELECT count(*) FROM public.gda_approved_memories WHERE workspace=w)>=100 THEN RAISE EXCEPTION 'Memory limit'; END IF;
INSERT INTO public.gda_approved_memories(workspace,content) VALUES(w,content);
ELSE UPDATE public.gda_approved_memories SET content=content WHERE workspace=w AND id=(p_data->>'id')::uuid; END IF;
RETURN '[]'::jsonb;
ELSIF p_action='gda_approved_memories.delete' THEN
DELETE FROM public.gda_approved_memories WHERE workspace=w AND id=(p_data->>'id')::uuid; RETURN '[]'::jsonb;
ELSIF p_action='gda_documents.select' THEN
SELECT coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) INTO r FROM (SELECT id,path,hash,updated_at FROM public.gda_documents WHERE workspace=w AND (p_data->>'path' IS NULL OR path=p_data->>'path') ORDER BY path LIMIT 12) t; RETURN r;
ELSIF p_action='gda_documents.delete' THEN
DELETE FROM public.gda_documents WHERE workspace=w AND id=(p_data->>'id')::uuid; RETURN '[]'::jsonb;
ELSIF p_action='gda_document_chunks.select' THEN
SELECT coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) INTO r FROM (SELECT c.content,c.embedding,c.ordinal,c.document_id,jsonb_build_object('path',d.path) AS gda_documents FROM public.gda_document_chunks c JOIN public.gda_documents d ON d.id=c.document_id AND d.workspace=w WHERE c.workspace=w ORDER BY d.path,c.ordinal LIMIT 288) t; RETURN r;
ELSIF p_action='index' THEN
IF p_data->>'path' IS NULL OR length(p_data->>'path')>500 OR p_data->>'hash' !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Invalid document'; END IF;
PERFORM pg_advisory_xact_lock(hashtextextended(w,0));
IF NOT EXISTS(SELECT 1 FROM public.gda_documents WHERE workspace=w AND path=p_data->>'path') AND (SELECT count(*) FROM public.gda_documents WHERE workspace=w)>=12 THEN RAISE EXCEPTION 'Document limit'; END IF;
d:=public.gda_replace_document(w,p_data->>'path',p_data->>'hash',p_data->'chunks'); RETURN to_jsonb(d);
END IF;
RAISE EXCEPTION 'Invalid operation';
END $$;
REVOKE EXECUTE ON FUNCTION public.gda_workspace_operation(text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.gda_workspace_operation(text,text,jsonb) TO anon,authenticated,service_role;
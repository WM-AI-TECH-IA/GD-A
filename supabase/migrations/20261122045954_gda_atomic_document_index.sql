/*
# Atomic document refresh
1. Change
Adds gda_replace_document(workspace,path,hash,chunks), a server-only function replacing the selected document's passages and version atomically. Each passage stores content, embedding and ordinal. No existing archive or unrelated document is changed.
2. Security
Invoker rights, pg_catalog-first fixed search_path with pg_temp. EXECUTE is revoked from PUBLIC/anon/authenticated and granted only to service_role. The server supplies the workspace derived from its browser capability.
3. Integrity
A failed passage insert rolls back the refresh, preserving the previous searchable version. Length and chunk count are bounded.
*/
CREATE OR REPLACE FUNCTION public.gda_replace_document(p_workspace text,p_path text,p_hash text,p_chunks jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,public,pg_temp AS $$
DECLARE d uuid;
BEGIN
IF jsonb_typeof(p_chunks) <> 'array' OR jsonb_array_length(p_chunks)>24 OR jsonb_array_length(p_chunks)=0 THEN RAISE EXCEPTION 'Invalid passages'; END IF;
INSERT INTO public.gda_documents(workspace,path,hash) VALUES(p_workspace,p_path,p_hash) ON CONFLICT(workspace,path) DO UPDATE SET hash=EXCLUDED.hash,updated_at=now() RETURNING id INTO d;
DELETE FROM public.gda_document_chunks WHERE document_id=d AND workspace=p_workspace;
INSERT INTO public.gda_document_chunks(document_id,workspace,content,embedding,ordinal) SELECT d,p_workspace,value->>'content',value->'embedding',(ordinality-1)::integer FROM jsonb_array_elements(p_chunks) WITH ORDINALITY;
RETURN d;
END $$;
REVOKE EXECUTE ON FUNCTION public.gda_replace_document(text,text,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gda_replace_document(text,text,text,jsonb) TO service_role;
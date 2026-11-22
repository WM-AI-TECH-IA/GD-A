/*
# GD-AURORAPERO controlled workspace
1. New private tables
Conversations (gda_chat_turns: workspace, question, answer, sources, time), approved memories (gda_approved_memories: workspace, content, time), selected documents (gda_documents: workspace, path, hash, time), passages (gda_document_chunks: document, workspace, content, embedding, ordinal), and hourly budgets (gda_request_windows: workspace, time, count). IDs are generated UUIDs.
2. Security
RLS and four deny policies per table prevent anon/authenticated direct access. Only service_role has CRUD grants. Server scopes every query to a hashed browser capability. The atomic budget function is invoker-rights, service-role-only, with fixed search_path.
3. Preservation
No existing tables or archive files are changed. Foreign key cascade applies only to removal of a newly imported document by its workspace owner.
*/
CREATE TABLE IF NOT EXISTS public.gda_chat_turns (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), workspace text NOT NULL, question text NOT NULL, answer text NOT NULL, sources jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS public.gda_approved_memories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), workspace text NOT NULL, content text NOT NULL CHECK (length(content) BETWEEN 1 AND 4000), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS public.gda_documents (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), workspace text NOT NULL, path text NOT NULL, hash text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(workspace,path));
CREATE TABLE IF NOT EXISTS public.gda_document_chunks (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), document_id uuid NOT NULL REFERENCES public.gda_documents(id) ON DELETE CASCADE, workspace text NOT NULL, content text NOT NULL, embedding jsonb, ordinal integer NOT NULL);
CREATE TABLE IF NOT EXISTS public.gda_request_windows (workspace text PRIMARY KEY, window_start timestamptz NOT NULL DEFAULT now(), requests integer NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS gda_turn_workspace_time ON public.gda_chat_turns(workspace,created_at);
CREATE INDEX IF NOT EXISTS gda_memory_workspace ON public.gda_approved_memories(workspace);
CREATE INDEX IF NOT EXISTS gda_chunks_workspace ON public.gda_document_chunks(workspace);
DO $$ DECLARE t text; BEGIN
FOREACH t IN ARRAY ARRAY['gda_chat_turns','gda_approved_memories','gda_documents','gda_document_chunks','gda_request_windows'] LOOP
EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated',t);
EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role',t);
EXECUTE format('DROP POLICY IF EXISTS "deny_select" ON public.%I',t);
EXECUTE format('CREATE POLICY "deny_select" ON public.%I FOR SELECT TO anon, authenticated USING (false)',t);
EXECUTE format('DROP POLICY IF EXISTS "deny_insert" ON public.%I',t);
EXECUTE format('CREATE POLICY "deny_insert" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (false)',t);
EXECUTE format('DROP POLICY IF EXISTS "deny_update" ON public.%I',t);
EXECUTE format('CREATE POLICY "deny_update" ON public.%I FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false)',t);
EXECUTE format('DROP POLICY IF EXISTS "deny_delete" ON public.%I',t);
EXECUTE format('CREATE POLICY "deny_delete" ON public.%I FOR DELETE TO anon, authenticated USING (false)',t);
END LOOP; END $$;
CREATE OR REPLACE FUNCTION public.gda_claim_request(p_workspace text) RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,public,pg_temp AS $$
DECLARE n integer;
BEGIN
INSERT INTO public.gda_request_windows(workspace,window_start,requests) VALUES(p_workspace,now(),1)
ON CONFLICT(workspace) DO UPDATE SET requests=CASE WHEN gda_request_windows.window_start < now()-interval '1 hour' THEN 1 ELSE gda_request_windows.requests+1 END, window_start=CASE WHEN gda_request_windows.window_start < now()-interval '1 hour' THEN now() ELSE gda_request_windows.window_start END RETURNING requests INTO n;
RETURN n<=30;
END $$;
REVOKE EXECUTE ON FUNCTION public.gda_claim_request(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gda_claim_request(text) TO service_role;
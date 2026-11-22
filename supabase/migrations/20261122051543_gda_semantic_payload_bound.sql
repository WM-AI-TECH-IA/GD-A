/*
# Bounded semantic indexing payload
1. Change
Raise the capability RPC JSON payload limit from 150 KB to 1 MB so up to 24 multilingual 1024-dimensional passage vectors fit alongside document text. Existing 24-passage, 12-document and workspace constraints remain in force.
2. Security and preservation
The RPC retains token-derived ownership, fixed search path and deny-by-default table access. Only the input size bound changes; no stored data is modified.
*/
DO $$ DECLARE definition text; BEGIN
SELECT pg_get_functiondef('public.gda_workspace_operation(text,text,jsonb)'::regprocedure) INTO definition;
EXECUTE replace(definition,'octet_length(p_data::text)>150000','octet_length(p_data::text)>1000000');
END $$;
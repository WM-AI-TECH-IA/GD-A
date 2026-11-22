/*
# Disambiguate memory correction
1. Change
Rename the local memory-content variable inside the capability RPC so a correction cannot be confused with the table's content column.
2. Security and preservation
The capability-derived ownership checks, privileges and fixed search path remain unchanged. No stored data is modified.
*/
DO $$ DECLARE definition text; BEGIN
SELECT pg_get_functiondef('public.gda_workspace_operation(text,text,jsonb)'::regprocedure) INTO definition;
definition:=replace(definition,'content text;','v_content text;');
definition:=replace(definition,'content:=p_data','v_content:=p_data');
definition:=replace(definition,'IF content IS NULL OR length(content)','IF v_content IS NULL OR length(v_content)');
definition:=replace(definition,'VALUES(w,content);','VALUES(w,v_content);');
definition:=replace(definition,'SET content=content WHERE','SET content=v_content WHERE');
EXECUTE definition;
END $$;
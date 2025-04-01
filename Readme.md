## run these to check for the supabase to gemeni ai summary generator
    -> npm install -g supabase or npm install supabase
    -> npx supabase login 
    after that they would ask for the auto login and want to use the code by clicking the auto login 
    -> npx supabase link --project-ref (project_ref_name) 
    #the project refrence name is https://supabase.com/dashboard/project/(the text here)
    -> npx functions deploy generate-summary 
    (generate-summary is the file in supabase/generate-summary/index.ts) #at this point they would ask to load or open the docker desktop do so and click on start of the docker desktop

    go to supabase at the Edge Function section add the GEMINI_API_KEY="XXXX"   and NEXT_PUBLIC_AI_SUMMARY_ENABLED=true

    -> you could test which functions are running by running ( npx supabase functions list)
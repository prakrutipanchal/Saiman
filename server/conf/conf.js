import dotenv from 'dotenv';
dotenv.config(); 

const conf = {
    supabase_project_url: process.env.SUPABASE_PROJECT_URL,
    supabase_api_key: process.env.SUPABASE_API_KEY,
    azure_blob_storage: process.env.AZUREBLOB_CONNECTION_STRING,
    blob_container_name: process.env.BLOB_CONTAINER_NAME
};

export default conf;

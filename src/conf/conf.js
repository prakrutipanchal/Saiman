const conf = {
    supabase_project_url: String(import.meta.env.VITE_SUPABASE_PROJECT_URL),
    supabase_api_key: String(import.meta.env.VITE_SUPABASE_API_KEY),
    azure_blob_storage: String(import.meta.env.VITE_AZUREBLOB_CONNECTION_STRING),
    blob_container_name: String(import.meta.env.VITE_BLOB_CONTAINER_NAME)
}

export default conf;
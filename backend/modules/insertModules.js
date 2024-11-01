const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yryikveitsajowqjuewz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyeWlrdmVpdHNham93cWp1ZXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3NjU1OTEsImV4cCI6MjA0MjM0MTU5MX0.wXBjw_ynVx9fTs15A54OkBXle66TkPl5y7CNelk5KQ4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to insert modules from JSON files, avoiding duplicates
async function insertModules() {
    const files = ['Module_1.json', 'Module_2.json', 'Module_3.json', 'Module_4.json', 'Module_5.json', 'Module_6.json', 'Module_7.json'];

    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));

        for (const [id, module] of Object.entries(data.modules)) {
            const { title } = module;
            const description = ""; // Adjust if you want to provide a description
            const order = id; // Use the id as the module order

            console.log(`Checking if module exists: ${title}, Order: ${order}`);

            // Check if the module already exists based on title or order
            const { data: existingModule, error: fetchError } = await supabase
                .from('modules')
                .select('*')
                .eq('module_name', title)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') { // Code 'PGRST116' means "no result found", which is OK
                console.error('Error checking for existing module:', fetchError);
                continue;
            }

            if (existingModule) {
                console.log(`Module already exists: ${title}, skipping insert.`);
                continue; // Skip insertion if the module already exists
            }

            // If no duplicates found, insert the module
            console.log(`Inserting module: ${title}, Description: ${description}, Order: ${order}`);

            const { data: insertData, error: insertError } = await supabase
                .from('modules')
                .insert([
                    { 
                        module_name: title,
                        module_description: description,
                        module_order: order
                    }
                ]);

            if (insertError) {
                console.error('Error inserting module:', insertError);
            } else {
                console.log('Inserted module:', insertData);
            }
        }
    }
}

// Call the function to insert modules
insertModules();

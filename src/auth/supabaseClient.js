import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fwcamxwuyehxmlvfrfos.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Y2FteHd1eWVoeG1sdmZyZm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5MDMxNjYsImV4cCI6MjA0MTQ3OTE2Nn0.bXs3I0ayMIc4wGEDqfKchFARcUKdr7Iao88kzTQVD34';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
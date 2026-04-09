const { v4: uuidv4 } = require('uuid');

module.exports = {
  async getAll(supabase) {
    const { data, error } = await supabase
      .from('taskmanager_users')
      .select('*');

    if (error) throw error;
    return data;
  },

  async getById(supabase, userId) {
    const { data, error } = await supabase
      .from('taskmanager_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async create(supabase, { telegram_id, username, first_name, last_name }) {
    if (!telegram_id) {
      throw new Error('telegram_id is required');
    }

    const { data, error } = await supabase
      .from('taskmanager_users')
      .insert([
        {
          id: uuidv4(),
          telegram_id,
          username,
          first_name,
          last_name,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  },

  async update(supabase, userId, { username, first_name, last_name }) {
    const { data, error } = await supabase
      .from('taskmanager_users')
      .update({ username, first_name, last_name })
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data[0];
  },

  async delete(supabase, userId) {
    const { data, error } = await supabase
      .from('taskmanager_users')
      .delete()
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data[0];
  },
};

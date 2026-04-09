const { v4: uuidv4 } = require('uuid');

module.exports = {
  async getAll(supabase) {
    const { data, error } = await supabase
      .from('taskmanager_tasks')
      .select('*');

    if (error) throw error;
    return data;
  },

  async getById(supabase, taskId) {
    const { data, error } = await supabase
      .from('taskmanager_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) throw error;
    return data;
  },

  async getByListId(supabase, listId) {
    const { data, error } = await supabase
      .from('taskmanager_tasks')
      .select('*')
      .eq('list_id', listId);

    if (error) throw error;
    return data;
  },

  async create(supabase, { list_id, title, description, due_date, priority }) {
    if (!list_id || !title) {
      throw new Error('list_id and title are required');
    }

    const { data, error } = await supabase
      .from('taskmanager_tasks')
      .insert([
        {
          id: uuidv4(),
          list_id,
          title,
          description,
          due_date,
          priority,
          is_completed: false,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  },

  async update(supabase, taskId, { title, description, due_date, priority, is_completed }) {
    const { data, error } = await supabase
      .from('taskmanager_tasks')
      .update({ title, description, due_date, priority, is_completed })
      .eq('id', taskId)
      .select();

    if (error) throw error;
    return data[0];
  },

  async delete(supabase, taskId) {
    const { data, error } = await supabase
      .from('taskmanager_tasks')
      .delete()
      .eq('id', taskId)
      .select();

    if (error) throw error;
    return data[0];
  },
};

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

  async getByListId(supabase, listId, { concise = false, status = 'all' } = {}) {
    let query = supabase
      .from('taskmanager_tasks')
      .select('*')
      .eq('list_id', listId);

    if (concise) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      query = query.or(`is_completed.eq.false,created_at.gte.${startOfToday.toISOString()}`);
    }

    if (status === 'completed') {
      query = query.eq('is_completed', true);
    } else if (status === 'pending') {
      query = query.eq('is_completed', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getByUserId(supabase, userId, { status = 'all' } = {}) {
    const { data: lists, error: listsError } = await supabase
      .from('taskmanager_lists')
      .select('id')
      .eq('user_id', userId);

    if (listsError) throw listsError;
    if (!lists.length) return [];

    const listIds = lists.map((l) => l.id);

    let query = supabase
      .from('taskmanager_tasks')
      .select('*')
      .in('list_id', listIds);

    if (status === 'completed') {
      query = query.eq('is_completed', true);
    } else if (status === 'pending') {
      query = query.eq('is_completed', false);
    }

    const { data, error } = await query;
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

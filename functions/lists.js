const { v4: uuidv4 } = require('uuid');

const LIST_WITH_COUNT_SELECT = '*, taskmanager_tasks(count)';

function withPendingTaskCount(list) {
  const { taskmanager_tasks, ...rest } = list;
  return { ...rest, pending_task_count: taskmanager_tasks?.[0]?.count ?? 0 };
}

module.exports = {
  async getAll(supabase) {
    const { data, error } = await supabase
      .from('taskmanager_lists')
      .select(LIST_WITH_COUNT_SELECT)
      .eq('taskmanager_tasks.is_completed', false);

    if (error) throw error;
    return data.map(withPendingTaskCount);
  },

  async getById(supabase, listId) {
    const { data, error } = await supabase
      .from('taskmanager_lists')
      .select(LIST_WITH_COUNT_SELECT)
      .eq('taskmanager_tasks.is_completed', false)
      .eq('id', listId)
      .single();

    if (error) throw error;
    return withPendingTaskCount(data);
  },

  async getByUserId(supabase, userId) {
    const { data, error } = await supabase
      .from('taskmanager_lists')
      .select(LIST_WITH_COUNT_SELECT)
      .eq('taskmanager_tasks.is_completed', false)
      .eq('user_id', userId);

    if (error) throw error;
    return data.map(withPendingTaskCount);
  },

  async create(supabase, { user_id, name }) {
    if (!user_id || !name) {
      throw new Error('user_id and name are required');
    }

    const { data, error } = await supabase
      .from('taskmanager_lists')
      .insert([
        {
          id: uuidv4(),
          user_id,
          name,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  },

  async update(supabase, listId, { name }) {
    const { data, error } = await supabase
      .from('taskmanager_lists')
      .update({ name })
      .eq('id', listId)
      .select();

    if (error) throw error;
    return data[0];
  },

  async delete(supabase, listId) {
    const { data, error } = await supabase
      .from('taskmanager_lists')
      .delete()
      .eq('id', listId)
      .select();

    if (error) throw error;
    return data[0];
  },
};

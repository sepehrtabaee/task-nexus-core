module.exports = {
  async getAll(supabase) {
    const { data, error } = await supabase
      .from('taskmanager_task_tags')
      .select('*');

    if (error) throw error;
    return data;
  },

  async getByTaskId(supabase, taskId) {
    const { data, error } = await supabase
      .from('taskmanager_task_tags')
      .select('*')
      .eq('task_id', taskId);

    if (error) throw error;
    return data;
  },

  async create(supabase, { task_id, tag_id }) {
    if (!task_id || !tag_id) {
      throw new Error('task_id and tag_id are required');
    }

    const { data, error } = await supabase
      .from('taskmanager_task_tags')
      .insert([
        {
          task_id,
          tag_id,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  },

  async delete(supabase, taskId, tagId) {
    const { data, error } = await supabase
      .from('taskmanager_task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag_id', tagId)
      .select();

    if (error) throw error;
    return data[0];
  },
};

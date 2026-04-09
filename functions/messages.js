const { v4: uuidv4 } = require('uuid');

module.exports = {
  async getLastMessages(supabase, userId, limit = 10) {
    const { data, error } = await supabase
      .from('taskmanager_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const chronological = (data || []).reverse();

    // Trim any trailing 'user' turns to maintain the alternating role invariant
    while (chronological.length && chronological[chronological.length - 1].role === 'user') {
      chronological.pop();
    }

    return chronological;
  },

  async createMessage(supabase, userId, role, content) {
    if (!userId || !role || !content) {
      throw new Error('userId, role, and content are required');
    }

    const { data, error } = await supabase
      .from('taskmanager_messages')
      .insert([{ id: uuidv4(), user_id: userId, role, content }])
      .select();

    if (error) throw error;
    return data[0];
  },
};

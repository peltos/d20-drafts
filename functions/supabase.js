const { supabaseUrl, supabaseKey } = require('../config.json');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function getFableById(id) {
  try {
    let { data, error, status } = await supabase
      .from('fable')
      .select(`*`)
      .eq('id', id)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      return data;
    } else {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function getPlotpointById(id) {
  try {
    let { data, error, status } = await supabase
      .from('plotpoint')
      .select(`*`)
      .eq('id', id)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      return data;
    } else {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function getReactionById(id) {
  try {
    let { data, error, status } = await supabase
      .from('reaction')
      .select(`*`)
      .eq('id', id)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      return data;
    } else {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function getAllActiveFables() {
  try {
    let { data, error, status } = await supabase
      .from('activeFable')
      .select(`*`)

    if (error && status !== 406) throw error;

    if (data) {
      return data;
    } else {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function getActiveFableByChannelId(channelId) {
  try {
    let { data, error, status } = await supabase
      .from('activeFable')
      .select(`*`)
      .eq('channelId', channelId)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      return data;
    } else {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function insertActiveFable(fable) {
  try {
    let { data, error, status } = await supabase
      .from('activeFable')
      .insert(fable)
      .select()
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      return data;
    } else {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function updateActiveFablePlotpoint(activeFable, plotpoint) {
  try {
    let { error } = await supabase
      .from('activeFable')
      .update({ currentPlotpoint: plotpoint })
      .eq('id', activeFable);

    if (error) {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}
async function updateActiveFableHP(activeFable, hp) {
  try {
    let { error } = await supabase
      .from('activeFable')
      .update({ hp: hp })
      .eq('id', activeFable);

    if (error) {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}
async function updateActiveFableTimeInterval(activeFable, timeInterval) {
  try {
    let { error } = await supabase
      .from('activeFable')
      .update({ timeInterval })
      .eq('id', activeFable);

    if (error) {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function getUserReactionCount(activeFable, plotpoint) {
  try {
    let { data, count, error, status } = await supabase
      .from('userReaction')
      .select('*', { count: 'exact', head: true })
      .eq('activeFable', activeFable)
      .eq('plotpoint', plotpoint);

    if (error && status !== 406) throw error;

    if (count >= 0) {
      return count;
    } else {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function deleteActiveFable(activeFable) {
  try {
    let { error } = await supabase
      .from('activeFable')
      .delete()
      .eq('id', activeFable);

    if (error) {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function upsertUserReaction(userReaction) {
  try {
    let { error } = await supabase.from('userReaction').upsert(userReaction);

    if (error) {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

async function deleteUserReactions(activeFable) {
  try {
    let { error } = await supabase
      .from('userReaction')
      .delete()
      .eq('activeFable', activeFable);

    if (error) {
      throw error;
    }
  } catch (error) {
    return error.code;
  }
}

module.exports = {
  getFableById,

  getPlotpointById,

  getReactionById,

  getAllActiveFables,
  getActiveFableByChannelId,
  insertActiveFable,
  updateActiveFablePlotpoint,
  updateActiveFableHP,
  updateActiveFableTimeInterval,
  deleteActiveFable,

  getUserReactionCount,
  upsertUserReaction,
  deleteUserReactions,
};

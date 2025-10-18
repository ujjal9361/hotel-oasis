import supabase from "./supabase";

export async function getSettings() {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) {
      console.error(error);
      throw new Error("Settings could not be loaded");
    }
    return data;
  } catch (err) {
    console.error("Error in getSettings:", err);
    throw err;
  }
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting) {
  try {
    const { data, error } = await supabase
      .from("settings")
      .update(newSetting)
      // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
      .eq("id", 1)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Settings could not be updated");
    }
    return data;
  } catch (err) {
    console.error("Error in updateSettings:", err);
    throw err;
  }
}

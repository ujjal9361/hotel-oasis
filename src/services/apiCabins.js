import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  try {
    const { data, error } = await supabase.from("cabins").select("*");
    if (error) {
      console.error(error);
      throw new Error("Cabins could not be loaded");
    }
    return data;
  } catch (err) {
    console.error("Error in getCabins:", err);
    throw err;
  }
}

export async function deleteCabin(id) {
  try {
    const { error } = await supabase
      .from("cabins")
      .delete()
      .eq("id", id)
      .select("image")
      .single();
    if (error) {
      throw new Error("Failed to delete cabin record");
    }
    //Extract the image name from the image URL
    // const oldImageName = data?.image?.split("/").pop();

    //Delete the existing image for the cabin
    //Skip for now since cabins can be duplicated and deleting the photo associated with a cabin can delete the image for other existing cabins
    // if (oldImageName) {
    //   const { error: deletionStorageError } = await deleteFromStorage(
    //     "cabin-images",
    //     oldImageName
    //   );
    //   if (deletionStorageError) {
    //     console.warn("Image deletion failed:", deletionStorageError.message);
    //   }
    // }
    return null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function createCabin(newCabin) {
  try {
    const imageExistsForCabin = typeof newCabin.image === "string";

    let imagePath = newCabin.image;
    //If the image does not exist, upload it
    if (!imageExistsForCabin) {
      const imageName = `${Math.random()}-${newCabin.image.name}`;

      //upload the image into storage
      const { error: uploadError } = await uploadToStorage(
        "cabin-images",
        newCabin.image,
        imageName
      );
      if (uploadError) {
        throw new Error("Image upload failed - cabin creation cancelled.");
      }
      imagePath =
        supabaseUrl + "/storage/v1/object/public/cabin-images/" + imageName;
    }

    //1.Upload the cabin record into database with the imagePath
    const { data, error } = await supabase
      .from("cabins")
      .insert([{ ...newCabin, image: imagePath }])
      .select()
      .single();
    if (error) {
      throw new Error("Failed to create cabin");
    }

    return data;
  } catch (err) {
    console.error("Error in createCabin:", err);
    throw err;
  }
}

export async function updateCabin(
  newCabinData,
  id,
  newImageUploaded,
  oldImageName = ""
) {
  try {
    let imagePath = newCabinData.image;
    //New Image uploaded
    if (newImageUploaded) {
      //Upload the new image for the cabin
      const imageName = `${Math.random()}-${newCabinData.image.name}`;
      imagePath =
        supabaseUrl + "/storage/v1/object/public/cabin-images/" + imageName;
      const { error: uploadError } = await uploadToStorage(
        "cabin-images",
        newCabinData.image,
        imageName
      );
      if (uploadError) {
        throw new Error("Image upload failed - cabin updation canceled");
      }

      //Delete the existing image for the cabin
      const { error: deletionStorageError } = await deleteFromStorage(
        "cabin-images",
        oldImageName
      );
      if (deletionStorageError) {
        console.warn("Old image deletion failed:", deletionStorageError);
      }
    }

    //If the image uploaded succesfully then update the database
    // 3. Update cabin record with new data
    const { data, error } = await supabase
      .from("cabins")
      .update({ ...newCabinData, image: imagePath })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      throw new Error("Failed to update cabin");
    }
    return data;
  } catch (err) {
    console.error("Error in updateCabin:", err);
    throw err;
  }
}

async function uploadToStorage(storageName, imageFile, filePath) {
  //2.Upload the image into the storage
  const { error } = await supabase.storage
    .from(storageName)
    .upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false,
    });

  return { error };
}
async function deleteFromStorage(storageName, imageName) {
  //Delete the existing image for the cabin
  const { error } = await supabase.storage
    .from(storageName)
    .remove([imageName]);

  return { error };
}

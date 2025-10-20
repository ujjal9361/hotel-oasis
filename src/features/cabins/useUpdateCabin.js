import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useUpdateCabin() {
  const queryClient = useQueryClient();
  const { mutate: updateCabinMutate, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id, newImageUploaded, oldImageName }) =>
      updateCabin(newCabinData, id, newImageUploaded, oldImageName),
    onSuccess: () => {
      toast.success(" Cabin succesfully edited");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { isEditing, updateCabinMutate };
}

import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export function useBookings() {
  const [searchParams] = useSearchParams();
  //FILTER
  const filterValueForStatus = searchParams.get("status");
  const filter =
    !filterValueForStatus || filterValueForStatus === "all"
      ? null
      : { field: "status", value: filterValueForStatus, method: "eq" };
  //SORTING
  const sortByFull = searchParams.get("sortBy") || "startDate-desc";
  const [field, order] = sortByFull.split("-");
  const sortBy = { field, order };
  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy],
    queryFn: () => getBookings({ filter, sortBy }),
  });

  return {
    isLoading,
    bookings,
    error,
  };
}

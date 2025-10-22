import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export function useBookings() {
  const [searchParams, setSearchParams] = useSearchParams();
  //FILTER
  const filterValueForStatus = searchParams.get("status");
  const filter =
    !filterValueForStatus || filterValueForStatus === "all"
      ? null
      : { field: "status", value: filterValueForStatus };
  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings", filter],
    queryFn: () => getBookings({ filter: filter, sortBy: {} }),
  });

  return {
    isLoading,
    bookings,
    error,
  };
}

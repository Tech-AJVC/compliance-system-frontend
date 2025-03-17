import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchData = async ({ pageIndex, pageSize, sortBy, filters, search }) => {
  const searchParams = {
    limit: pageSize,
    skip: pageIndex * pageSize,
    sort: sortBy,
    name: search,
    ...filters.reduce((acc, filter) => {
      acc[filter.filterid] = filter.optionid;
      return acc;
    }, {}),
  };
  const response = await apiWithAuth.get("/api/documents/", {
    params: searchParams,
  });
  const { documents, total } = response.data;
  return { data: documents || [], totalCount: total || 0 };
};

export const useGetAllDocuments = ({
  pageIndex,
  pageSize,
  search = "",
  sortBy = [],
  filters = [],
}) => {
  const first_sort = sortBy.at(0);
  const sort = first_sort
    ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
    : "";
  return useQuery({
    queryKey: ["task-querry", pageIndex, pageSize, sort, filters, search],
    queryFn: () =>
      fetchData({ pageIndex, pageSize, sortBy: sort, filters, search }),
    placeholderData: keepPreviousData => keepPreviousData,
  });
};

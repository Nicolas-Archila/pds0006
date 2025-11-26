import { 
    DeviceCriteria, 
    DeviceFilterQuery, 
    DeviceSortQuery, 
    newDeviceCriteria 
} from "@/core/domain";

import * as z from "zod";

// VALIDAR CLAVES DEL QUERY CON REGEX (Zod 3 soporta esto)
const QUERY_PARAM_KEYS_SCHEMA = z.union([
  z.string().regex(/^filter\[[^\]]+\]$/), // ejemplo: filter[name]
  z.literal("sort"),
  z.literal("limit"),
  z.literal("offset"),
]);

export const CRITERIA_QUERY_PARAMS_SCHEMA = z.record(
  QUERY_PARAM_KEYS_SCHEMA,
  z.unknown()
);

export type CriteriaQueryParams = z.infer<typeof CRITERIA_QUERY_PARAMS_SCHEMA>;

const filterKeyRegex = /^filter\[(.+?)\]$/;

export class CriteriaHelper {
  static parseFromQuery(queryParams: CriteriaQueryParams): DeviceCriteria {
    const criteria = newDeviceCriteria();

    for (const key in queryParams) {
      const value = queryParams[key];

      const filterParsed = this.parseFilterFromEntry(key, value);
      if (filterParsed) criteria.filterBy = filterParsed;

      const sortParsed = this.parseSortFromEntry(key, value);
      if (sortParsed) criteria.sortBy = sortParsed;
    }

    return criteria;
  }

  private static parseFilterFromEntry(
    key: string,
    value: unknown
  ): DeviceFilterQuery | undefined {
    const separatedKey = key.match(filterKeyRegex);
    if (!separatedKey) return undefined;

    const field = separatedKey[1];

    return {
      field,
      value,
    };
  }

  private static parseSortFromEntry(
    key: string,
    value: unknown
  ): DeviceSortQuery | undefined {
    if (key !== "sort") return undefined;
    if (typeof value !== "string") return undefined;

    const isAscending = !value.startsWith("-");

    const field = isAscending ? value : value.substring(1);

    return {
      field,
      isAscending,
    };
  }
}

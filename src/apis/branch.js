import http from "@/utilities/http";

//取得店家資訊
export function getBranchApi() {
  return http({
    url: "/Branches",
  });
}

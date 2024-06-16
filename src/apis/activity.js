import http from "@/utilities/http";

//取得店家資訊
export function getActivitiesApi() {
  return http({
    url: "/Activities",
    method: "GET",
  });
}

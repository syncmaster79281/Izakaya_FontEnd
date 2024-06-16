import http from "@/utilities/http";

//取得店家資訊
export function getHotProductApi(count, showtime, days) {
  return http({
    url: `/Orders/GetHotProduct?Count=${count}&StartTime=${showtime}&Days=${days}`,
    method: "get",
  });
}

import http from "@/utilities/http";

//依會員ID取得會員票夾
export function getRewardsApi(userId) {
  //   console.log("測試");

  return http({
    url: `/rewards/${userId}`,
    method: "get",
  });
}

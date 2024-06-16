import http from "@/utilities/http";

//依店家ID取得座位資訊
export function getBranchSeatApi(id) {
  return http({
    url: `/Seats/${id}`,
  });
}

//依店家ID取得座位資訊
export function getOrderByRandomApi(random) {
  return http({
    url: `/Reservations/${random}`,
  });
}

//依店家ID取得座位資訊
export function putOrderApi(form) {
  return http({
    method: 'PUT',
    url: `/Reservations`,
    data: form,
  });
}

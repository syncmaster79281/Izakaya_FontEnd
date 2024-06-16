import http from "@/utilities/http";

export function GetProductCategoryApi() {
  return http({
    url: "/SeatCarts/GetProductCategory",
    method: "get",
  });
}

export function GetProductApi(branchId) {
  return http({
    url: `/SeatCarts/Getpruduct?BranchId=${branchId}&Stock=0&IsLaunched=true`,
  });
}

export function PlaceOrderApi(orderDataList) {
  return http({
    url: "/SeatCarts",
    method: "post",
    data: orderDataList,
  });
}

export function GetHistoryApi(seatId, orderTime) {
  return http({
    url: `/SeatCarts?SeatId=${seatId}&OrderTime=${orderTime}`,
    method: "get",
  });
}

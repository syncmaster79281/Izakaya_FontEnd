import http from "@/utilities/http";

//取得訂單資訊
export function getOrderApi(combinedOrderId) {
  return http({
    url: `/OrderPayments/GetOrder/${combinedOrderId}`,
    method: "get",
  });
}

//取的訂單資訊
export function getPaymentApi(memberId, paymentTime, paymentMethodId) {
  return http({
    url: `/OrderPayments?MemberId=${memberId}&PaymentTime=${paymentTime}&PaymentMethodId=${paymentMethodId}`,
    method: "get",
  });
}

//取的歷史訂單資訊
export function getMemberPaymentApi(memberId) {
  return http({
    url: `/OrderPayments/${memberId}`,
    method: "get",
  });
}

//取得訂單資料
export function getOrderDataApi(combinedOrderId) {
  return http({
    url: `/OrderPayments/GetPaymentList/${combinedOrderId}`,
    method: "get",
  });
}

//LinePay Request APi
export function LinePayRequestApi(requestData) {
  return http({
    url: `/LinePay/Request`,
    method: "post",
    data: requestData,
  });
}

//LinePay Confirm APi
export function LinePayConfirmApi(requestData) {
  return http({
    url: `/LinePay/Confirm?transactionId=${requestData.transactionId}&orderId=${requestData.orderId}`,
    method: "post",
    data: requestData.paymentConfirmDto,
  });
}

//修改訂單狀態
export function updateOrderStatusApi(orderPaymentDto) {
  return http({
    url: `/OrderPayments/${orderPaymentDto.combinedOrderId}`,
    method: "put",
    data: orderPaymentDto,
  });
}

//取的優惠券資訊
export function getRewardsApi(memberId) {
  return http({
    url: `/OrderPayments/GetRewards/${memberId}`,
    method: "get",
  });
}
//刪除優惠券
export function deleteRewardApi(id) {
  return http({
    url: `/OrderPayments/DeleteReward/${id}`,
    method: "delete",
  });
}

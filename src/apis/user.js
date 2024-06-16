import http from "@/utilities/http";

//依店家ID取得座位資訊
export function loginApi({ email, password }) {
  return http({
    url: "/logins",
    method: "post",
    data: {
      email,
      password,
    },
  });
}

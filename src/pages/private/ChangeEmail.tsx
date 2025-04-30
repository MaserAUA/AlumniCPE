import React, { useEffect } from "react";
import { useEmailConfirm } from "../../api/auth"
import { useAuthContext } from "../../context/auth_context";
import { useGetUserById } from "../../hooks/useUser";
import { useNavigate, useSearchParams } from "react-router-dom";

const ChangeEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userId, isLoading } = useAuthContext();
  const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId || "");

  const token = searchParams.get("token");

  const email = userData?.contact_info?.email;
  const emailConfirm = useEmailConfirm(email);

  useEffect(() => {
    if (isLoadingUser || !email || !token) return;

    emailConfirm.mutate(token, {
      onSuccess() {
        navigate("/editprofile");
      },
      onError(error) {
        console.error(error)
        navigate("/");
      },
    });
  }, [email, token, isLoadingUser]);
  return null;
};

export default ChangeEmail;

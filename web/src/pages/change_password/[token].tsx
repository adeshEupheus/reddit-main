import { NextPage } from "next";
import React from "react";
import { useFormik } from "formik";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useMutation } from "urql";
import { useLoginMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { useChangePasswordMutation } from "../../generated/graphql";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      token,
    },
    validate: () => {
      type error = {
        [key: string]: any;
      };
      const errors: error = {};
      if (!formik.values.newPassword) {
        errors.newPassword = "required";
      } else if (formik.values.newPassword.length <= 2) {
        errors.newPassword = "password length must be greater than 2";
      }

      return errors;
    },
    onSubmit: async (values) => {
      // console.log(values)
      const response = await changePassword(values);
      if (response.data?.changePassword.errors) {
        console.log(response.data.changePassword.errors);
        // formik.errors.username = response.data.login.errors[0].message;
        if (response.data.changePassword.errors[0].field === "token") {
          formik.errors.newPassword =
            response.data.changePassword.errors[0].message;
        }
        // else if (response.data.login.errors[0].field === "username") {
        //   formik.errors.usernameOrEmail = response.data.login.errors[0].message;
        // }
      } else if (response.data?.changePassword.user) {
        router.push("/");
      }
    },
  });
  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <form
        onSubmit={formik.handleSubmit}
        className="sm:w-1/4 w-[90%] p-8 bg-slate-500 rounded-md"
      >
        <FormControl className="mt-4">
          <FormLabel htmlFor="usernameOrEmail">Enter New Password</FormLabel>
          <Input
            id="newPassword"
            name="newPassword"
            type="newPassword"
            variant="filled"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.newPassword}
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <h1 className="text-red-600">{formik.errors.newPassword}</h1>
          ) : (
            ""
          )}
        </FormControl>

        <Button
          isLoading={formik.isSubmitting}
          className="mt-4"
          type="submit"
          colorScheme="purple"
          width="full"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);

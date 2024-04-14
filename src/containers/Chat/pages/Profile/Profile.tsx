import { Avatar, Button, Input, Skeleton, Spin } from "antd";

import {
  UserOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ReactNode, useEffect, useRef, useState } from "react";
import c from "./Profile.module.scss";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AuthActions } from "../../../../store/slices/AuthSlice";
import { motion } from "framer-motion";
import { pageAnimation } from "../shared/animation/animationHandler";
import { NotifActions } from "../../../../store/slices/NotificationSlice";
import {
  apiCheckEmailExists,
  apiCheckUsernameExists,
  getProfileData,
  updateProfileData,
  updateProfilePicture,
} from "../../../../client/ApiClient";
import { useAppSelector } from "../../../../store/ReduxHooks";
import {
  MenuSvg,
  PicturePlus,
} from "../../../../shared/assets/svg/SvgProvider";
import { ComponentActions } from "../../../../store/slices/ComponentSlice";

type Validation = {
  isValid: boolean;
  errorMessage: string;
};

type InputConfig = {
  type: "text" | "password";
  prefix: ReactNode;
  placeHolder: string;
  maxLength: number;
  visibilityToggle?: boolean;
};

type Field = {
  label: string;
  value: string;
  validation: (value: string) => any;
  isValid: boolean;
  errorMessage: string;
  isTouched: boolean;
  isLoading: boolean;
  input_config: InputConfig;
};

type FormData = {
  feilds: { [key: string]: Field };
};

const Profile = () => {
  const usernameCounter = useRef(0);
  const userData = useAppSelector((state) => state.auth.userData);
  const emailCounter = useRef(0);
  const currentProfile = useRef<{ [key: string]: string }>({});
  const dispatch = useDispatch();

  const [updateFormData, setUpdateFormData] = useState<FormData>({
    feilds: {
      username: {
        label: "Username",
        value: "",
        validation: (value: string) => {
          const testingValue = value.trim();
          const validation: Validation = {
            isValid: true,
            errorMessage: "",
          };

          if (currentProfile.current.username.trim() === testingValue)
            return setValidation("username", validation);

          if (testingValue.length < 4) {
            validation.isValid = false;
            validation.errorMessage =
              "username must be longer than 3 characters";
            return setValidation("username", validation);
          }

          // check if username already exists

          setUpdateFormData((old) => {
            const newFormData = { ...old };
            const newFeilds = { ...newFormData.feilds };
            const newFeild = { ...newFeilds.username };
            newFeild.isLoading = true;
            newFeilds.username = newFeild;
            newFormData.feilds = newFeilds;
            return newFormData;
          });
          usernameCounter.current++;
          const counter = usernameCounter.current;
          apiCheckUsernameExists(testingValue)
            .then((res) => {
              if (res.data && testingValue !== userData?.username) {
                validation.isValid = false;
                validation.errorMessage = "username already exists!";
              }
            })
            .catch((_err) => {
              validation.isValid = false;
              validation.errorMessage = "connection error";
            })
            .finally(() => {
              if (usernameCounter.current !== counter) return;

              setValidation("username", validation);
            });
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "text",
          prefix: <UserOutlined className={c.PrefixIcon} />,
          placeHolder: "Username",
          maxLength: 25,
        },
      },
      personal_name: {
        label: "Personal Name",
        value: "",
        validation: (value: string) => {
          const testingValue = value.trim();
          const validation: Validation = {
            isValid: true,
            errorMessage: "",
          };

          if (testingValue.length < 4) {
            validation.isValid = false;
            validation.errorMessage = "name must be longer than 3 characters";

            return setValidation("personal_name", validation);
          }

          setValidation("personal_name", validation);
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "text",
          prefix: <UserOutlined className={c.PrefixIcon} />,
          placeHolder: "Personal Name",
          maxLength: 25,
        },
      },
      email: {
        label: "E-mail",
        value: "",
        validation: (value: string) => {
          const testingValue = value.trim();
          const validation = {
            isValid: true,
            errorMessage: "",
          };

          if (currentProfile.current.email.trim() === testingValue)
            return setValidation("email", validation);

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testingValue)) {
            validation.isValid = false;
            validation.errorMessage = "invalid email";
            return setValidation("email", validation);
          }

          setUpdateFormData((old) => {
            const newFormData = { ...old };
            const newFeilds = { ...newFormData.feilds };
            const newFeild = { ...newFeilds.email };
            newFeild.isLoading = true;
            newFeilds.email = newFeild;
            newFormData.feilds = newFeilds;
            return newFormData;
          });
          emailCounter.current++;
          const counter = emailCounter.current;

          apiCheckEmailExists(testingValue)
            .then((res) => {
              if (res.data) {
                validation.isValid = false;
                validation.errorMessage = "email already exists!";
              }
            })
            .catch((_err) => {
              validation.isValid = false;
              validation.errorMessage = "connection error";
            })
            .finally(() => {
              if (emailCounter.current !== counter) return;
              setValidation("email", validation);
            });
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "text",
          prefix: <span className={c.PrefixIcon}>@</span>,
          placeHolder: "Email",
          maxLength: 60,
        },
      },
    },
  });

  const [profilePicture, setProfilePicture] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPic, setIsUpdatingPic] = useState(false);
  const fileUploader = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const isFormValid = function () {
    for (const feild in updateFormData.feilds) {
      if (!updateFormData.feilds[feild].isValid) {
        return false;
      }
    }

    return true;
  };

  function validateAll() {
    for (const feild in updateFormData.feilds) {
      if (!updateFormData.feilds[feild].isValid) {
        updateFormData.feilds[feild].validation(
          updateFormData.feilds[feild].value
        );
      }
    }
  }

  // const resetFeildsParent = useCallback(function (feilds : Field) {
  //   (feilds.init = function () {
  //     for (let i in this) {
  //       if (typeof this[i] == "object") {
  //         this[i].parent = this;
  //       }
  //     }
  //     delete this.init;
  //   }),
  //     feilds.init();
  // }, []);

  // const setloading = useCallback(function (key : string, value : string) {
  //   setUpdateFormData((prevFormData) => {
  //     const newFormData = { ...prevFormData };
  //     const newFeilds = { ...newFormData.feilds };
  //     const selectedFeild = { ...newFeilds[key] };

  //     selectedFeild.isTouched = true;
  //     selectedFeild.isValid = false;
  //     // selectedFeild.isLoading = value;

  //     newFeilds[key] = selectedFeild;

  //     // resetFeildsParent(newFeilds);

  //     newFormData.feilds = newFeilds;
  //     return newFormData;
  //   });
  // }, []);

  const setValidation = useCallback(function (
    key: string,
    validation: Validation
  ) {
    setUpdateFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      const newFeilds = { ...newFormData.feilds };
      const selectedFeild = { ...newFeilds[key] };

      selectedFeild.isTouched = true;
      selectedFeild.isValid = validation.isValid;
      selectedFeild.errorMessage = validation.errorMessage;
      selectedFeild.isLoading = false;
      newFeilds[key] = selectedFeild;
      // resetFeildsParent(newFeilds);
      newFormData.feilds = newFeilds;
      return newFormData;
    });
  },
  []);

  const fetchProfileData = useCallback(
    function () {
      if (isLoading) return;
      setIsLoading(true);
      setIsError(false);
      getProfileData(userData?.access_token ?? "undefined")
        .then((res) => {
          setProfilePicture(res.data.profile_picture);

          setUpdateFormData((prevFormData) => {
            const newFormData = { ...prevFormData };
            const newFeilds = { ...newFormData.feilds };

            for (const key in newFeilds) {
              if (!res.data[key]) continue;
              const selectedFeild = { ...newFeilds[key] };
              selectedFeild.isTouched = false;
              selectedFeild.isValid = false;
              selectedFeild.isLoading = false;
              selectedFeild.value = res.data[key];
              newFeilds[key] = selectedFeild;
            }

            // resetFeildsParent(newFeilds);
            newFormData.feilds = newFeilds;
            return newFormData;
          });

          currentProfile.current = res.data;
        })
        .catch((_err) => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [isLoading, isError]
  );

  const changeValue = useCallback(function (key: string, newValue: string) {
    setUpdateFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      const newFeilds = { ...newFormData.feilds };
      const selectedFeild = { ...newFeilds[key] };

      selectedFeild.isTouched = true;
      selectedFeild.value = newValue;

      newFeilds[key] = selectedFeild;
      // resetFeildsParent(newFeilds);
      newFormData.feilds = newFeilds;
      return newFormData;
    });

    updateFormData.feilds[key].validation(newValue);
  }, []);

  function updateData() {
    if (isUpdatingInfo) return;

    if (!isFormValid()) {
      return validateAll();
    }
    setIsUpdatingInfo(true);
    const updateData: { [key: string]: string } = {};
    for (const feild in updateFormData.feilds) {
      updateData[feild] = updateFormData.feilds[feild].value;
    }
    updateProfileData(userData?.access_token ?? "undefined", updateData)
      .then((_res) => {
        currentProfile.current = updateData;

        dispatch(
          NotifActions.notify({
            type: "success",
            message: "Profile info updated!",
          })
        );
        dispatch(AuthActions.setUsername(updateData.username));
      })
      .catch((err) => {
        console.log("update profile err", err);
      })
      .finally(() => {
        setIsUpdatingInfo(false);
      });
  }

  const updatePic = useCallback(
    function (image: File) {
      if (isUpdatingPic || !image) return;
      setIsUpdatingPic(true);

      updateProfilePicture(userData?.access_token ?? "undefined", image)
        .then((res) => {
          setProfilePicture(res.data.newUrl);
          dispatch(AuthActions.setProfilePicture(res.data.newUrl));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsUpdatingPic(false);
        });
    },
    [isUpdatingPic]
  );

  const displayReady = !isLoading && !isError;
  return (
    <motion.div {...pageAnimation} className={c.Profile} layout>
      <header className={c.Header}>My Profile</header>
      <MenuSvg
        className={c.Menu}
        onClick={() => {
          dispatch(ComponentActions.openNav());
        }}
      />

      <div className={c.ProfilPicHolder}>
        {isLoading ? (
          <Skeleton.Avatar className={c.ProfilPic} active size={90} />
        ) : null}
        {displayReady ? (
          <div
            style={{
              width: "fit-content",
              borderRadius: "100%",
              backgroundColor: "var(--primary-blank)",
              position: "relative",
            }}
          >
            <input
              ref={fileUploader}
              type={"file"}
              style={{
                display: "none",
              }}
              onChange={(e) => {
                updatePic(e.target.files?.[0] as File);
              }}
            />
            <Spin
              spinning={isUpdatingPic}
              indicator={
                <LoadingOutlined
                  style={{
                    color: "var(--primary-soft)",
                  }}
                />
              }
            >
              <Avatar
                onClick={() => {
                  fileUploader.current?.click();
                }}
                size={90}
                src={profilePicture}
                style={{
                  fontSize: "2rem",
                }}
                className={"util-pointer util-capitalized " + c.ProfilPic}
              >
                {userData?.username[0] ?? "U"}
              </Avatar>
            </Spin>
            <div
              className={c.ProfilPicHoverer}
              onClick={() => {
                fileUploader.current?.click();
              }}
            >
              <PicturePlus />
            </div>
          </div>
        ) : null}
      </div>
      <div className={c.ProfilInfoHolder}>
        {isLoading ? <Skeleton active /> : null}
        {displayReady
          ? Object.keys(updateFormData.feilds).map((key) => {
              const feild = updateFormData.feilds[key];
              const config = feild.input_config;

              const props = {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  changeValue(key, e.target.value);
                },
                value: feild.value,
                maxLength: config.maxLength,
                placeholder: config.placeHolder,
                className: c.Input,
                status:
                  !feild.isValid && feild.isTouched && !feild.isLoading
                    ? "error"
                    : ("" as "error" | ""),
                prefix: config.prefix,
                suffix: feild.isValid ? (
                  <CheckOutlined
                    style={{
                      color: "green",
                    }}
                  />
                ) : feild.isLoading ? (
                  <LoadingOutlined
                    style={{
                      color: "var(--primary-soft)",
                    }}
                  />
                ) : null,
                visibilityToggle: false,
              };

              let InputType: typeof Input = Input;

              if (config.type === "password") {
                InputType = Input.Password as typeof Input;
                props.visibilityToggle = !!config.visibilityToggle;
              }
              return (
                <div className={c.DataChanger} key={key}>
                  <label className={c.Label}>{feild.label}</label>
                  <div className={c.InputHolder}>
                    {feild.errorMessage ? (
                      <div className={c.InputError}>{feild.errorMessage}</div>
                    ) : null}
                    <InputType {...props} />
                  </div>
                </div>
              );
            })
          : null}
        {displayReady ? (
          <Button
            className={c.EditButton}
            loading={isUpdatingInfo}
            onClick={updateData}
          >
            Edit Profile
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
};

export default Profile;

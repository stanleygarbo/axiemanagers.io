import { useState } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

import { FormikField } from "../components/FormikField";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Button from "../components/Button";
import { useScholars } from "../contexts/scholarsContext";

const ScholarSchema = Yup.object().shape({
  minQuota: Yup.number()
    .min(0, "Too low")
    .max(600, "Too high")
    .required("Required"),
});

const SettingsMinQuota = () => {
  const { colors } = useTheme();

  const { minQuota, updateMinQuota } = useScholars();

  const [isSaveable, setIsSaveable] = useState(false);

  const errorFieldStyle = {
    border: `1px solid ${colors.danger}`,
  };

  const inputFieldStyles = {
    border: `1px solid transparent`,
  };

  const onChangeHandler: React.ChangeEventHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(e.target.value) !== minQuota) {
      setIsSaveable(true);
    } else {
      setIsSaveable(false);
    }
  };

  return (
    <Container colors={colors}>
      <p>Min Quota</p>
      <Formik
        validationSchema={ScholarSchema}
        enableReinitialize
        initialValues={{
          minQuota: minQuota,
        }}
        onSubmit={(values, { resetForm }) => {
          setIsSaveable(false);
          updateMinQuota(values.minQuota);
          resetForm();
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <FormikField
              colors={colors}
              type="number"
              placeholder="Min-quota"
              autoComplete="off"
              name="minQuota"
              style={{
                ...inputFieldStyles,
                ...(errors.minQuota && touched.minQuota && errorFieldStyle),
                maxWidth: 60,
                padding: "5px 10px",
              }}
              onKeyUp={onChangeHandler}
            />
            <Button
              foreground={colors.textIntense}
              type="submit"
              disabled={(errors.minQuota && touched.minQuota) || !isSaveable}
              style={{
                border:
                  errors.minQuota || !isSaveable
                    ? colors.BGLight
                    : `1px solid ${colors.accent}`,
                background:
                  errors.minQuota || !isSaveable
                    ? colors.BGLighter
                    : colors.accent,
                marginLeft: 10,
              }}
            >
              Save
            </Button>
            <br />
            <span className="error">{errors.minQuota}</span>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    color: ${colors.textNotSoIntense};
    flex: 1;
    padding: 20px;

    p {
      margin-bottom: 10px;
    }

    .error {
      color: ${colors.danger};
      font-size: 12px;
    }
  `}
`;

export default SettingsMinQuota;

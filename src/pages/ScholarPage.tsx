import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import Button from "../components/Button";
import { FormikField } from "../components/FormikField";
import { LineChart } from "../components/LineChart";
import { useScholars } from "../contexts/scholarsContext";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { BiSave } from "react-icons/bi";
import { useState } from "react";

import * as Yup from "yup";
import { truncate } from "../util/truncate";
import Progress from "../components/Progress";
import DeleteButton from "../components/DeleteButton";
import { AiOutlineCheck } from "react-icons/ai";
import NotFoundMessage from "../components/NotFoundMessage";
import { AiFillHeart, AiFillFire } from "react-icons/ai";
import { BiRun } from "react-icons/bi";
import { GiRoundStar } from "react-icons/gi";
import { axieColors } from "../colors/colors";
import moment from "moment";
import CircularLoader from "../components/CircularLoader";
import { addCommaToNumber } from "../util/addCommaToNumber";
import ColorPicker from "../components/ColorPicker";
import { useQuery, useQueryClient } from "react-query";
import {
  fetchScholarAxies,
  // fetchScholarAxies,
  fetchScholarByAddress,
  fetchScholarReports,
  fetchSLPPrice,
} from "../api/requests";
import {
  Scholar,
  ScholarReports,
  Scholars,
} from "../interfaces/IResponseTypes";
import ErrorMessage from "../components/ErrorMessage";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { useUserPreferences } from "../contexts/userPreferences";
import { getCurrencySign } from "../util/getCurrencySign";
import ReportsTable from "../components/ReportsTable";
import TabSelector from "../components/scholar-page/TabSelector";

const ValidationSchema = Yup.object().shape({
  nickname: Yup.string().max(50, "too long").required("Required"),
  managerShare: Yup.number()
    .min(0, "Too low")
    .max(100, "Too high")
    .required("Required"),
});

const DummyData = ["5", "8", "10", "18", "19"];

const ScholarPage = () => {
  const { ronin } = useParams<{ ronin: string }>();
  const { scholars, updateScholar, deleteScholar, categories } = useScholars();
  const { colors } = useTheme();
  const [isSaveable, setIsSaveable] = useState(false);
  // const [scholar, setScholar] = useState();
  const scholar = scholars?.find((obj) => obj.ronin === ronin);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"reports" | "axies">("reports");
  const [earnedHoveredElement, setEarnedHoveredElement] = useState<{
    x: string;
    y: string;
  } | null>(null);
  const queryParams = new URLSearchParams(useLocation().search);
  const queries = {
    referrer: queryParams.get("referrer"),
    name: queryParams.get("name"),
  };
  const { currency } = useUserPreferences();

  const queryClient = useQueryClient();

  const roninAddress = ronin ? ronin.toString().replace("ronin:", "0x") : "";

  const scholarQuery = useQuery<Scholar, any>(
    ["Scholar", roninAddress],
    () => fetchScholarByAddress(roninAddress),
    {
      staleTime: 60000,
    }
  );

  const scholarReportsQuery = useQuery<ScholarReports>(
    ["ScholarReports", roninAddress],
    () => fetchScholarReports(roninAddress),
    {
      staleTime: Infinity,
    }
  );

  const axiesQuery = useQuery(
    ["Axies", roninAddress],
    () => fetchScholarAxies(roninAddress),
    {
      staleTime: Infinity,
    }
  );

  const SLPPriceQuery = useQuery(
    ["SLPPrice", currency],
    () => fetchSLPPrice(currency),
    {
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (scholarReportsQuery.data && scholarReportsQuery.data.length < 1) {
      setActiveTab("axies");
    }
  }, [scholarReportsQuery.data]);

  const removeScholarFromCache = () => {
    queryClient.setQueryData<Scholars>("Scholars", (old: any) => {
      console.log(old.list[ronin]);
      old.earnings.total -= old.list[ronin].total;
      delete old.list[ronin];

      return old;
    });
  };

  const ctgry = categories.find((obj) => obj.name === scholar?.category)?.quota;

  const chartDate =
    scholarQuery.data?.chart !== null && scholarQuery.data?.chart.length! > 2
      ? scholarQuery.data?.chart.map((i) =>
          moment.unix(i.date).format("MMMM D, YYYY hh:mm A")
        )
      : DummyData;
  const chartEarnings =
    scholarQuery.data?.chart !== null && scholarQuery.data?.chart.length! > 2
      ? scholarQuery.data?.chart.map((i) => i.earned.toString())
      : DummyData;

  const nameChangeHandler: React.ChangeEventHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value !== scholar?.nickname) {
      setIsSaveable(true);
    } else {
      setIsSaveable(false);
    }
  };

  const managerShareChangeHandler: React.ChangeEventHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(e.target.value) !== scholar?.managerShare) {
      setIsSaveable(true);
    } else {
      setIsSaveable(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "/coinzilla.js";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (scholarQuery.isLoading) {
    return (
      <FullScreenLoader>
        <CircularLoader size="large" />
      </FullScreenLoader>
    );
  }

  if (scholarQuery.data)
    return (
      <Container colors={colors}>
        {scholarQuery.error ? (
          <ErrorMessage
            title={scholarQuery.error?.message}
            message={"Something went wrong, please try again later"}
          />
        ) : (
          <>
            <ActionComplete
              routeAfter="/"
              message="Scholar Deleted"
              activate={isDeleted}
            />

            {!scholar && !queries.referrer && !queries.name ? (
              <NotFoundMessage />
            ) : (
              <>
                <div className="wrapper">
                  <div className="wrapper__data">
                    <div className="wrapper__data__value">
                      <img src="/slp.png" alt="slp" width={30} />
                      {addCommaToNumber(
                        earnedHoveredElement
                          ? earnedHoveredElement.y
                          : scholarQuery.data?.total -
                              scholarQuery.data?.totalClaimable
                      )}{" "}
                      ≈ {getCurrencySign(currency)}
                      {addCommaToNumber(
                        Math.round(
                          earnedHoveredElement
                            ? Number(earnedHoveredElement.y) *
                                (SLPPriceQuery?.data
                                  ? SLPPriceQuery?.data["smooth-love-potion"][
                                      currency ? currency : "php"
                                    ]
                                  : 0)
                            : (Number(scholarQuery.data?.total) -
                                Number(scholarQuery.data?.totalClaimable)) *
                                (SLPPriceQuery?.data
                                  ? SLPPriceQuery?.data["smooth-love-potion"][
                                      currency ? currency : "php"
                                    ]
                                  : 0)
                        )
                      )}
                    </div>
                    <div className="wrapper__data__color">
                      {scholar && (
                        <ColorPicker
                          color={scholar ? scholar.color : colors.accent}
                          setActiveColor={(selectedHex: string) =>
                            updateScholar({
                              ronin: scholar.ronin,
                              color: selectedHex,
                              nickname: scholar.nickname,
                              managerShare: scholar.managerShare,
                              category: scholar.category,
                            })
                          }
                        />
                      )}
                    </div>
                    <div className="wrapper__data__date">
                      {scholarQuery?.data.chart !== null && earnedHoveredElement
                        ? earnedHoveredElement.x
                        : moment
                            .unix(scholarQuery?.data.lastUpdated)
                            .format("MMMM D, YYYY hh:mm A")}
                    </div>
                    <div className="wrapper__data__line-chart">
                      {scholarQuery?.data.chart === null ||
                      scholarQuery?.data.chart?.length < 3 ? (
                        <div className="wrapper__data__line-chart__notice">
                          <h3>
                            The Chart will propagate after 3 days prior to using
                            axiemanagers.io to track your scholar.
                          </h3>
                        </div>
                      ) : null}
                      <LineChart
                        data={chartEarnings}
                        color={scholar ? scholar.color : colors.accent}
                        title={`${
                          scholar ? scholar.nickname : queries.name
                        }'s performance`}
                        labels={chartDate}
                        showLabels={true}
                        maintainAspectRatio={false}
                        setHoveredElements={setEarnedHoveredElement}
                      />
                    </div>
                  </div>
                  <div className="wrapper__scholar-info">
                    <Formik
                      validationSchema={ValidationSchema}
                      initialValues={{
                        nickname: scholar ? scholar.nickname : queries.name,
                        managerShare: scholar ? scholar.managerShare : 0,
                      }}
                      onSubmit={(values) => {
                        if (scholar && values.nickname) {
                          updateScholar({
                            ronin: scholar.ronin,
                            color: scholar.color,
                            nickname: values.nickname,
                            managerShare: values.managerShare,
                            category: scholar.category,
                          });
                          setIsSaveable(false);
                        }
                      }}
                    >
                      {({ touched, errors }) => (
                        <Form className="wrapper__scholar-info__form">
                          <FormikField
                            onKeyUp={nameChangeHandler}
                            autoComplete="off"
                            type="text"
                            name="nickname"
                            placeholder="Nickname"
                            colors={colors}
                            style={{
                              background: colors.BGDark,
                              gridColumn: "span 2",
                              border:
                                touched.nickname &&
                                errors.nickname &&
                                `1px solid ${colors.danger}`,
                            }}
                          />

                          <div
                            className="wrapper__scholar-info__form__ronin"
                            style={{ gridColumn: "span 2" }}
                          >
                            <a
                              href={`https://marketplace.axieinfinity.com/profile/${ronin}/axie`}
                              target="blank"
                              style={{
                                color: colors.textNotSoIntense,
                                textDecoration: "underline",
                              }}
                            >
                              {ronin && truncate(ronin, 29)}
                            </a>
                          </div>
                          {scholar && (
                            <>
                              <section className="wrapper__scholar-info__form__manager-share">
                                Manager&apos;s Share:
                                <FormikField
                                  onKeyUp={managerShareChangeHandler}
                                  autoComplete="off"
                                  type="number"
                                  name="managerShare"
                                  placeholder="%"
                                  colors={colors}
                                  style={{
                                    background: colors.BGDark,
                                    minWidth: 50,
                                    maxWidth: 50,
                                    border:
                                      touched.managerShare &&
                                      errors.managerShare &&
                                      `1px solid ${colors.danger}`,
                                  }}
                                />
                              </section>
                              <Button
                                disabled={
                                  !isSaveable ||
                                  !!(touched.nickname && errors.nickname) ||
                                  !!(
                                    touched.managerShare && errors.managerShare
                                  )
                                }
                                bgColor={
                                  isSaveable &&
                                  !(touched.nickname && errors.nickname) &&
                                  !(touched.managerShare && errors.managerShare)
                                    ? colors.accent
                                    : colors.BGDark
                                }
                                type="submit"
                                foreground={
                                  isSaveable &&
                                  !(touched.nickname && errors.nickname) &&
                                  !(touched.managerShare && errors.managerShare)
                                    ? "#ffffff"
                                    : colors.textNotSoIntense
                                }
                                style={{
                                  padding: 6,
                                  borderRadius: 6,
                                  border: `1px solid ${
                                    colors.textIntense + 20
                                  }`,
                                  height: 47,
                                  width: 47,
                                }}
                              >
                                <BiSave size={32} />
                              </Button>
                            </>
                          )}
                        </Form>
                      )}
                    </Formik>

                    <div className="wrapper__scholar-info__wrapper">
                      <div className="wrapper__scholar-info__wrapper__total">
                        <img src="/slp.png" alt="slp" width={40} />
                        <span>
                          {addCommaToNumber(scholarQuery?.data.total)}
                        </span>
                      </div>
                      <div className="wrapper__scholar-info__wrapper__dates">
                        <time>
                          Last Claimed{" "}
                          {scholarQuery?.data.lastClaimed !== 0
                            ? moment
                                .unix(scholarQuery?.data.lastClaimed)
                                .fromNow()
                            : "N/A"}
                        </time>
                        <time>
                          Next Claim{" "}
                          {scholarQuery?.data.lastClaimed !== 0
                            ? moment
                                .unix(scholarQuery?.data.lastClaimed)
                                .add(14, "days")
                                .fromNow()
                            : "Anytime"}
                        </time>
                      </div>
                    </div>

                    <div className="wrapper__scholar-info__stats">
                      {/* <div
                        className="wrapper__scholar-info__stats__today"
                        style={{ marginRight: 20 }}
                      >
                        <div className="wrapper__scholar-info__stats__today__value">
                          <img src="/slp.png" alt="" width={20} />
                          {today}
                        </div>
                        <div className="wrapper__scholar-info__stats__today__label">Today</div>
                      </div> */}
                      {/* <div className="wrapper__scholar-info__stats__today" style={{ marginRight: 20 }}>
            <div className="wrapper__scholar-info__stats__today__value">
              <img src="/slp.png" alt="" width={20} />
              {average}
            </div>
            <div className="wrapper__scholar-info__stats__today__label">Average</div>
          </div> */}
                      <div
                        className="wrapper__scholar-info__stats__today"
                        style={{ marginRight: 20 }}
                      >
                        <div className="wrapper__scholar-info__stats__today__value">
                          {scholarQuery.data?.mmr}
                        </div>
                        <div className="wrapper__scholar-info__stats__today__label">
                          MMR
                        </div>
                      </div>
                      <div className="wrapper__scholar-info__stats__today">
                        <div className="wrapper__scholar-info__stats__today__value">
                          #{scholarQuery.data?.rank}
                        </div>
                        <div className="wrapper__scholar-info__stats__today__label">
                          Rank
                        </div>
                      </div>
                    </div>

                    <div className="wrapper__scholar-info__progress">
                      {scholar && (
                        <DeleteButton
                          onClick={() => {
                            removeScholarFromCache();
                            setIsDeleted(true);
                            deleteScholar({ ronin: scholar.ronin });
                          }}
                        />
                      )}
                      {scholarQuery.data?.lastClaimed !== 0 ? (
                        <Progress earned={scholarQuery?.data?.today} />
                      ) : (
                        <div className="wrapper__scholar-info__progress__na">
                          Progress
                          <br />
                          N/A
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ad">
                  <div className="notice">
                    <div className="notice__title">Notice</div>
                    <p>
                      A feature where you will be able to see and download
                      reports will be coming soon.
                    </p>
                  </div>
                  <div className="coinzilla" data-zone="C-8615a9fd1747a828">
                    <p>728 x 90 coinzilla ad placeholder</p>
                  </div>
                </div>

                <div className="layout-selector">
                  <TabSelector
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                  />
                </div>

                {activeTab === "reports" ? (
                  <ReportsTable
                    reports={scholarReportsQuery.data}
                    lastClaimed={scholarQuery.data?.lastClaimed}
                    minQuota={ctgry ? ctgry : 75}
                  />
                ) : (
                  <>
                    <h2>{scholar?.nickname}&apos;s Axies</h2>
                    {/* {ScholarAxies.error} */}
                    {axiesQuery.isLoading && (
                      <div className="axie-loader">
                        <CircularLoader size="large" />
                      </div>
                    )}
                    <div className="team">
                      {axiesQuery.data?.length ? null : (
                        <div className="team__message">
                          <span className="team__message__nickname">
                            {" "}
                            {scholar?.nickname}
                          </span>{" "}
                          has no axies
                        </div>
                      )}
                      {axiesQuery.data?.map((i) => (
                        <div
                          key={i.id}
                          className="team__axie"
                          onClick={() => {
                            window.open(
                              `https://marketplace.axieinfinity.com/axie/${i.id}`,
                              "_blank"
                            );
                          }}
                        >
                          <div className="team__axie__class">{i.class}</div>
                          <img
                            height={"100%"}
                            src={`https://axiecdn.axieinfinity.com/axies/${i.id}/axie/axie-full-transparent.png`}
                            alt=""
                          />
                          <div className="team__axie__info">
                            <div
                              className="team__axie__info__name"
                              style={{
                                background:
                                  i.class === "Aquatic"
                                    ? axieColors.aquatic
                                    : i.class === "Beast"
                                    ? axieColors.beast
                                    : i.class === "Bug"
                                    ? axieColors.bug
                                    : i.class === "Bird"
                                    ? axieColors.bird
                                    : i.class === "Plant"
                                    ? axieColors.plant
                                    : i.class === "Reptile"
                                    ? axieColors.reptile
                                    : i.class === "Dusk"
                                    ? axieColors.dusk
                                    : i.class === "Dawn"
                                    ? axieColors.dawn
                                    : i.class === "Mech"
                                    ? axieColors.mech
                                    : "",
                              }}
                            >
                              Axie #{i.id}
                            </div>
                            <div className="team__axie__info__stat">
                              Breed Count: {i.breedCount}
                              <br />
                              <div className="team__axie__info__stat__grid">
                                <section>
                                  <AiFillHeart
                                    style={{
                                      color: colors.success,
                                      marginBottom: -3,
                                    }}
                                  />{" "}
                                  {i.stats.hp}
                                </section>
                                <section>
                                  <BiRun
                                    style={{
                                      color: colors.warning,
                                      marginBottom: -3,
                                    }}
                                  />{" "}
                                  {i.stats.speed}
                                </section>
                                <section>
                                  <GiRoundStar
                                    style={{
                                      color: colors.accent,
                                      marginBottom: -3,
                                    }}
                                  />{" "}
                                  {i.stats.skill}
                                </section>
                                <section>
                                  <AiFillFire
                                    style={{
                                      color: colors.danger,
                                      marginBottom: -3,
                                    }}
                                  />{" "}
                                  {i.stats.morale}
                                </section>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Container>
    );
  return <div></div>;
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;

    .ad {
      margin: 0 auto;
      margin-bottom: 20px;
      margin-top: 20px;
      max-width: 1200px;
      display: flex;
      justify-content: center;
      display: grid;
      grid-template-columns: 1fr 728px;
      gap: 10px;

      .notice,
      .coinzilla {
        border: 1px dashed ${colors.textIntense + 30};
        padding: 10px;
        border-radius: 5px;

        &__title {
          color: ${colors.textNotSoIntense};
          font-size: 16px;
          font-weight: 500;
        }
        p {
          color: ${colors.textIntense + 90};
          font-size: 13px;
          margin-top: 3px;
        }
      }

      .coinzilla {
        min-height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .layout-selector {
      margin-bottom: 20px;
    }

    @media (max-width: 1152px) {
      .ad {
        .notice,
        .coinzilla {
          &__title {
            font-size: 14px;
          }
          p {
            font-size: 11px;
          }
        }
      }
    }
    @media (max-width: 1091px) {
      .ad {
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
        gap: 0;
        margin-left: 16px;
        margin-right: 16px;

        .coinzilla {
          width: 100%;
        }
        .notice {
          display: none;
          // margin-top: 20px;
        }
      }
    }

    .wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr 360px;
      gap: 20px;
      &__data,
      &__scholar-info {
        padding: 20px;
        border-radius: 5px;
        min-height: 365px;
        max-height: 365px;
        /* background-image: url("/paper2.png");
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat; */
        background-color: ${colors.BGLight};
        position: relative;
        border: 1px solid ${colors.textIntense + 20};

        &__stats {
          display: flex;
          justify-content: center;

          &__today {
            color: ${colors.textNotSoIntense};
            margin: 15px 0;
            display: flex;
            flex-direction: column;
            align-items: center;

            &__value {
              display: flex;
              align-items: center;
            }

            &__label {
              margin-top: 5px;
              font-size: 11px;
              color: ${colors.textIntense + 75};
            }
          }
        }

        &__form {
          align-items: center;
          display: grid;
          grid-template-columns: 1fr 47px;
          gap: 10px;
          input {
            min-width: 100px;
            border: 1px solid ${colors.textIntense + 20};
            font-size: 20px;
            padding: 7px 10px;
          }
          &__ronin {
            margin-top: -8px;
            color: ${colors.textNotSoIntense + 80};
          }
          section {
            display: flex;
            justify-content: space-between;
            font-size: 1.2rem;
            color: ${colors.textNotSoIntense};
          }
        }
        &__wrapper {
          display: flex;
          align-items: center;
          &__dates {
            display: flex;
            flex-direction: column;
            color: ${colors.textNotSoIntense};
            font-size: 15px;
            margin-left: 10px;
          }
          &__total {
            display: flex;
            flex-direction: column;
            background-color: ${colors.BGDark};
            border-radius: 5px;
            color: ${colors.textNotSoIntense};
            position: relative;
            width: 70px;
            height: 70px;
            align-items: center;
            justify-content: center;
            border: 1px solid ${colors.textIntense + 20};
            margin-top: 20px;
            span {
              font-weight: 700;
              font-size: 16px;
            }
          }
        }
        &__progress {
          margin: 30px 0px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 88%;
          position: absolute;
          bottom: -10px;
          &__na {
            color: ${colors.textNotSoIntense};
            font-size: 15px;
            text-align: center;
          }
        }
      }
      &__data {
        grid-column: span 2;
        position: relative;
        &__color {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }
        &__value {
          font-size: 2rem;
          font-weight: 600;
          color: ${colors.textIntense};
          display: flex;
          align-items: center;
        }
        &__date {
          color: ${colors.textNotSoIntense};
        }
        &__line-chart {
          height: 250px;
          position: relative;
          &__notice {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: none;
            backdrop-filter: blur(2px);
            /* background-color: #ffffff05; */
            color: ${colors.textIntense};
            display: grid;
            place-items: center;
            /* border-radius: 20px; */
            h3 {
              padding: 0px 10px;
              text-align: center;
              max-width: 400px;
              font-size: 14px;
            }
          }
        }
      }
    }
    h2 {
      color: ${colors.textNotSoIntense};
    }
    .axie-loader {
      width: 100%;
      display: grid;
      place-items: center;
      height: 100px;
    }
    .team {
      display: grid;
      width: 100%;
      margin-top: 20px;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;

      &__message {
        color: ${colors.textNotSoIntense};

        border: 1px dashed ${colors.textIntense + 30};
        padding: 40px 100px;
        border-radius: 5px;
        justify-self: start;

        &__nickname {
          color: ${colors.textIntense};
        }
      }

      &__axie {
        color: ${colors.textNotSoIntense};
        background-color: ${colors.BGLight};
        display: flex;
        border-radius: 5px;
        justify-content: space-around;
        position: relative;
        border: 1px solid ${colors.textIntense + 20};
        cursor: pointer;

        &:hover {
          border: 1px solid ${colors.accent};
        }

        &__class {
          position: absolute;
          top: 20px;
          left: 30px;
          font-size: 14px;
        }
        img {
          width: 200px;
          object-fit: contain;
          margin-left: -20px;
          transform: translateY(20px);
        }
        &__info {
          font-size: 14px;
          padding: 20px;
          margin-left: -30px;

          &__name {
            border-radius: 5px;
            color: #fff;
            padding: 2px 8px;
            margin-bottom: 5px;
          }
          &__stat__grid {
            font-size: 18px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: fit-content;
            gap: 5px;
            margin-top: 15px;
          }
        }
      }
    }
    @media (max-width: 1025px) {
      .wrapper {
        gap: 20px;
      }
    }
    @media (max-width: 700px) {
      padding: 1rem 0px;
      .wrapper {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        &__scholar-info {
          grid-column: span 2;
          padding: 1rem;
          border-radius: 0px;
        }
        &__data {
          border-radius: 0px;
          padding: 0px;
          &__line-chart {
            min-height: 240px;
            max-height: 240px;
          }
          &__value {
            padding: 1rem 0 0 1rem;
          }
          &__date {
            padding: 0 0 1rem 1rem;
          }
        }
      }
      h2 {
        padding: 0 1rem;
      }
      .team {
        margin-top: 0;
        padding: 1rem;
        gap: 1rem;
      }

      .layout-selector {
        padding: 0 16px;
      }
    }
  `}
`;

const FullScreenLoader = styled.div`
  width: 100%;
  height: calc(100vh - 140px);
  display: grid;
  place-items: center;
`;

const StyledOverlay = styled.div<{ activate: boolean; colors: IColors }>`
  ${({ activate, colors }) => css`
    position: fixed;
    top: 0;
    left: 0;
    transition: 0.6s ease-in-out;
    z-index: 100;
    width: 100%;
    height: 0%;
    overflow: hidden;
    ${activate &&
    css`
      height: 100%;
    `}
    display: grid;
    place-items: center;
    background-color: ${colors.BGLight};
    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      .message {
        color: ${colors.textNotSoIntense};
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 70px;
      }
      .icon {
        background: ${colors.success};
        width: 100px;
        height: 100px;
        color: #fff;
        display: grid;
        place-items: center;
        border-radius: 100%;
        transform: scale(1);
        ${activate &&
        css`
          animation: pop 1s;
          @keyframes pop {
            0% {
              transform: scale(0);
            }
            50% {
              transform: scale(0);
            }
            80% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      }
    }
  `}
`;

const ActionComplete: React.FC<{
  activate: boolean;
  message: string;
  routeAfter: string;
}> = ({ activate, message, routeAfter }) => {
  const { colors } = useTheme();
  const history = useHistory();

  return (
    <StyledOverlay colors={colors} activate={activate}>
      <div className="wrapper">
        <div className="icon">
          <AiOutlineCheck size={50} />
        </div>
        <div className="message">{message}</div>
        <Button
          type="button"
          disabled={false}
          bgColor="transparent"
          style={{
            border: `1px solid ${colors.textIntense + 20}`,
            borderRadius: 5,
          }}
          foreground={colors.textNotSoIntense}
          onClick={() => history.push(routeAfter)}
        >
          Continue
        </Button>
      </div>
    </StyledOverlay>
  );
};

export default ScholarPage;

import React from "react";
import {
  DetailsList,
  SpinButton,
  PrimaryButton,
  Stack,
  SelectionMode,
  ChoiceGroup,
  Text,
  PivotItem,
  Pivot
} from "office-ui-fabric-react";

import dayjs from "dayjs";
import "dayjs/locale/de";
import { BierPicker } from "./Bierpicker";
import { Statistik } from "./statistik";
dayjs.locale("de");
export const DATE_FORMAT = "dddd, DD.MM.YYYY HH:mm";

interface IBier {
  _id: string;
  amount: number;
  created: string;
  date: string;
}

interface IProps {
  userId: string;
}

interface IState {
  biere: IBier[];
  amount: number;
  saving: boolean;
  statistik: any[];
}

export class Bierliste extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { biere: [], amount: 0, saving: false, statistik: [] };
  }

  componentDidMount() {
    this.getBiere();
    this.getStatistik();
  }
  getBiere = () => {
    fetch(`/_api/user/${this.props.userId}/bier`)
      .then(result => result.json())
      .then(biere => {
        biere = biere.map((bier: IBier) => {
          bier.date = dayjs(bier.created).format(DATE_FORMAT);
          return bier;
        });
        this.setState({ biere });
      });
  };
  getStatistik = () => {
    fetch("/_api/statistik")
      .then(result => result.json())
      .then(statistik => {
        this.setState({ statistik });
      });
  };
  addBier = () => {
    this.setState({ saving: true });
    fetch("/_api/user/" + this.props.userId + "/bier", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: this.state.amount,
        userId: this.props.userId
      })
    })
      .then(result => result.json())
      .then(bier => {
        bier.date = dayjs().format(DATE_FORMAT);
        let biere = [bier].concat(this.state.biere);
        this.getStatistik();
        this.setState({ biere, saving: false, amount: 0 });
      });
  };
  render() {
    return (
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack
          style={{
            boxShadow: "0px 0px 6px rgba(0,0,0,.3)",
            background: "#ffffff",
            padding: "6px"
          }}
          tokens={{ childrenGap: 6 }}
        >
          <BierPicker
            amount={8}
            onSelect={amount => this.setState({ amount })}
            selectedAmount={this.state.amount}
          />

          <PrimaryButton
            disabled={this.state.saving || this.state.amount === 0}
            onClick={() => {
              this.addBier();
            }}
          >
            Hinzufügen
          </PrimaryButton>
        </Stack>
        <Stack horizontal horizontalAlign="space-between">
          <Text variant="xLarge">Status: </Text>
          <Text variant="xLarge">
            {this.state.biere.reduce((accu, item) => {
              return accu + (item.amount == -24 ? -15 : item.amount);
            }, 0)}
          </Text>
        </Stack>
        <div
          style={{
            boxShadow: "0px 0px 6px rgba(0,0,0,.3)",
            background: "#ffffff"
          }}
        >
          <Pivot>
            <PivotItem headerText="Deine History">
              <DetailsList
                selectionMode={SelectionMode.none}
                items={this.state.biere}
                columns={[
                  {
                    fieldName: "amount",
                    key: "amount",
                    name: "Flaschen",
                    minWidth: 0,
                    onRender: item => {
                      return (
                        <span>
                          {item.amount == -24
                            ? "Kiste mitgebracht"
                            : `${item.amount} Flasche${
                                item.amount > 1 ? "n" : ""
                              } getrunken`}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "date",
                    key: "date",
                    name: "Datum",
                    minWidth: 200
                  }
                ]}
              />
            </PivotItem>
            <PivotItem headerText="Statistik" style={{ padding: "12px" }}>
              <Statistik statistik={this.state.statistik} />
            </PivotItem>
          </Pivot>
        </div>
      </Stack>
    );
  }
}

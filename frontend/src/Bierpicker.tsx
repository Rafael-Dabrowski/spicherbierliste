import React from "react";
import { Stack } from "office-ui-fabric-react";
import { thisExpression } from "@babel/types";

interface IProps {
  amount: number;
  onSelect: (amount: number) => void;
  selectedAmount: number;
}

export class BierPicker extends React.Component<IProps> {
  getPicker() {
    let picks = [];
    for (let i= 1; i <= this.props.amount; i++) {
      picks.push(
        <div
          style={{
            width: "55px",
            height: "55px",
            background: "#FFDC00",
            display:"flex", 
            alignItems: "center",
            justifyContent:"center",
            flexGrow:1,
            cursor:"pointer",
            border:
              "1px solid " +
              (this.props.selectedAmount === i ? "#111111" : "transparent")
          }}
          onClick={() => {
            this.props.onSelect(i);
          }}
        >
          {i}
        </div>
      );
    }
    return picks;
  }
  render() {
    return (
      <Stack horizontal tokens={{ childrenGap: 5 }} horizontalAlign="start" wrap={true}>
        {this.getPicker()}
        <div
          style={{
            width: "55px",
            height: "55px",
            background: "#FFDC00",
            display:"flex", 
            alignItems: "center",
            justifyContent:"center",
            flexGrow:2,
            cursor:"pointer",
            border:
              "1px solid " +
              (this.props.selectedAmount === -24 ? "blue" : "transparent")
          }}
          onClick={() => {
            this.props.onSelect(-24);
          }}
        >
          Kiste dabei
        </div>
      </Stack>
    );
  }
}

import React from "react";
import { DetailsList, Stack, Text } from "office-ui-fabric-react";
import dayjs from "dayjs";
import { DATE_FORMAT } from "./Bierliste";

interface IProps {
  statistik: any[];
}
export class Statistik extends React.Component<IProps> {
  render() {
    return (
      <Stack tokens={{ childrenGap: 10 }}>
        {this.props.statistik.map(stat => {
          return (
            <Stack key={stat._id} horizontal horizontalAlign="space-between">
              <Stack>
                <Text>{stat.user[0].name}</Text>
                <Text variant="small" style={{ color: "#aaaaaa" }}>
                  {dayjs(stat.lastEntry).format(DATE_FORMAT)}
                </Text>
              </Stack>
              <Text variant="xxLarge">{stat.amount}</Text>
            </Stack>
          );
        })}
      </Stack>
    );
  }
}

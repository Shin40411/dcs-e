import { Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";
import { fDate } from "src/utils/format-time-vi";
import { IDateValue } from "src/types/common";

export const renderDates = (createdDate?: IDateValue, quotationNo?: string) => {
    const styles = useStyles();

    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                <Text style={[styles.text4, { fontFamily: 'Niramit' }]}>TP. HCM, {fDate(createdDate)}</Text>
                <Text style={{ fontFamily: 'Niramit-SemiBold', fontSize: 13 }}>Số: {quotationNo}</Text>
            </View>
        </View>
    );
}
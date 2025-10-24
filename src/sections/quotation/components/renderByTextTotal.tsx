import { Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";
import { capitalizeFirstLetter } from "src/utils/format-string";
import { fRenderTextNumber } from "src/utils/format-number";

export const renderByTextTotal = (totalAmount?: number) => {
    const styles = useStyles();
    const roundedTotal = Math.round(totalAmount ?? 0);

    return (
        <View style={[{
            width: '100%',
            flexDirection: 'row',
            padding: '20px 20px 0 39px',
            gap: 5
        }]}>
            <Text style={{ fontFamily: 'Niramit-SemiBold', fontSize: 13 }}>
                Bằng chữ:
            </Text>
            <Text style={{ fontFamily: 'Niramit-LightItalic', fontSize: 13 }}>
                <Text>{capitalizeFirstLetter(fRenderTextNumber(roundedTotal))}</Text>
            </Text>
        </View>
    );
}
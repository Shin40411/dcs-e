import { Image, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";
import { ICompanyInfoItem } from "src/types/companyInfo";

export const renderHeader = ({ companyInfoData }: { companyInfoData: ICompanyInfoItem | null }) => {
    const styles = useStyles();
    return (
        <View style={[styles.header]} fixed>
            <View style={{ width: '100%', flexDirection: 'row' }}>
                <Image source={companyInfoData?.logoBase64 || "/logo/DCS9.png"} style={{ width: 70, height: 30 }} />
            </View>
        </View>
    );
}
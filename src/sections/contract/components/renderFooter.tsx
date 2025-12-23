import { Image, Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";
import { ICompanyInfoItem } from "src/types/companyInfo";

export const renderFooter = ({ companyInfoData }: { companyInfoData: ICompanyInfoItem | null; }) => {
    const styles = useStyles();

    return (
        <View style={[styles.container, styles.footer]} fixed>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column', width: '100%', alignItems: 'flex-end' }}>
                    <View style={{ marginTop: 5, paddingLeft: 70, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{
                            fontFamily: 'Niramit',
                            fontSize: 8
                        }}
                        >
                            W.  {companyInfoData?.link || `http://dcse.vn `}  |   E.  {companyInfoData?.email || `lienhe@dcse.vn`}
                        </Text>
                        <View style={{ width: 1, height: '100%', backgroundColor: '#ddd', marginLeft: 4, marginRight: 4 }} />
                        <Text
                            style={[styles.textNiramit, { fontSize: 11 }]}
                            render={({ pageNumber, totalPages }) =>
                                `Trang ${pageNumber}/${totalPages}`
                            }
                        />
                    </View>
                </View>
            </View>
            {/* <Image
                src="/assets/illustrations/footerContract.png"
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: 200,
                    height: 200,
                    objectFit: 'cover',
                    opacity: 1
                }}
            /> */}
        </View>
    );
}
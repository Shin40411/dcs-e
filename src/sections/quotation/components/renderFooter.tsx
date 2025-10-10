import { Image, Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";

export const renderFooter = () => {
    const styles = useStyles();

    return (
        <View style={[styles.container, styles.footer]} fixed>
            <Image
                src="/assets/illustrations/bgpdf.png"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 1,
                }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '65%' }}>
                </View>
                <View style={{ flexDirection: 'column', width: '35%', alignItems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 1, height: '100%', backgroundColor: '#ddd', marginRight: 4 }} />
                        <Text
                            style={[styles.textNiramit, { fontSize: 11, color: 'rgba(68, 73, 77, 1)' }]}
                            render={({ pageNumber, totalPages }) =>
                                `Trang ${pageNumber}/${totalPages}`
                            }
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
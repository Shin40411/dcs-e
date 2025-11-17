import { Image, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";

export const renderHeader = () => {
    const styles = useStyles();
    return (
        <View style={[styles.header]} fixed>
            <View style={{ width: '100%', flexDirection: 'row' }}>
                <Image source="/logo/DCS9.png" style={{ width: 70, height: 30 }} />
            </View>
        </View>
    );
}
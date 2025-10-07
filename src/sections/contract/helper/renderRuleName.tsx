import { Text, View } from "@react-pdf/renderer";

export function RenderRuleName({ first, second }: { first: string; second: string; }) {
    return (
        <Text style={{ fontSize: 13, fontFamily: "Niramit-Bold" }}>
            <Text style={{ textDecoration: "underline" }}>{first}</Text>{" "}
            <Text style={{ textTransform: "uppercase" }}>{second}</Text>
        </Text>
    );
}
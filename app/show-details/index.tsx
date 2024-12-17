import React, { useEffect, useState } from "react";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, StyleSheet, SafeAreaView, Pressable, Alert, Image } from "react-native";

export default function ShowDetails() {
    const { orderId } = useLocalSearchParams();
    const [ticketInfo, setTicketInfo] = useState<any>(null);
    const [entryCount, setEntryCount] = useState<number>(0);
    const navigation = useRouter();

    const handleApiCall = async () => {
        try {
            const response = await axios.get(
                `https://www.tghcc.in/api/payments/getEnteries?orderId=${orderId}`,
                {
                    headers: {
                        'auth-key': `6795fb2bbd23a96508d00bf90f4dd0b3`,
                    },
                }
            );
            const data = response.data.data;
            setTicketInfo(data);
            setEntryCount(data?.numberOfTickets - data?.guestCheckIns);
        } catch (error: any) {
            Alert.alert(
                "Error",
                (error?.response?.data?.message || "Something went wrong please try again."),
                [
                    {
                        text: "OK",
                        onPress: () => navigation.push(`/scanner`),
                    },
                ]
            );
        }
    };

    useEffect(() => {
        handleApiCall();
    }, [orderId]);

    const decrementEntry = () => {
        setEntryCount((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const incrementEntry = () => {
        if (entryCount < (ticketInfo.numberOfTickets - ticketInfo.guestCheckIns)) {
            setEntryCount((prev) => prev + 1);
        }
    };

    const putEntries = async () => {
        try {
            const response = await axios.put(
                `https://www.tghcc.in/api/payments/putEnteries?orderId=${orderId}`,
                {
                    orderId: orderId, makeEntry: entryCount,
                },
                {
                    headers: {
                        'auth-key': `6795fb2bbd23a96508d00bf90f4dd0b3`,
                    },
                }
            );
            Alert.alert(
                "Info",
                response?.data?.message || "Something went wrong please try again.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.push(`/`),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert(
                "Info",
                error?.response?.data?.error || "Something went wrong please try again.",
                [
                    {
                        text: "OK",
                        onPress: () => error.response.status !== 400 && navigation.push(`/`),
                    },
                ]
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../../assets/images/Frame.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <Stack.Screen options={{ title: "Show-Details", headerShown: false }} />

            <View style={styles.card}>
                <Text style={styles.title}>Opportunities in E-commerce</Text>
                <View style={styles.icon}>
                    <Icon name="event" size={20} color="#555" />
                    <Text style={styles.infoText}>21th Dec, 2024</Text>
                </View>
                <View style={styles.icon}>
                    <Icon name="access-time" size={20} color="#555" />
                    <Text style={styles.infoText}>10:00 AM</Text>
                </View>
                <View style={styles.icon}>
                    <Icon name="location-on" size={20} color="#555" />
                    <Text style={styles.infoText}>Ch. Ranbir Singh Auditorium, GJU, Hisar</Text>
                </View>
                <View style={{ ...styles.row, flexDirection: 'row', gap: 10, marginTop: 20 }}>
                    <View>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>{ticketInfo?.name || "N/A"}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Mobile number</Text>
                        <Text style={styles.value}>{ticketInfo?.phoneNo || "N/A"}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View>
                        <Text style={styles.label}>Number of Tickets</Text>
                        <Text style={styles.value}>{ticketInfo?.numberOfTickets || "0"}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Already Entered</Text>
                        <Text style={styles.value}>{ticketInfo?.guestCheckIns || "0"}</Text>
                    </View>
                </View>


                {/* Make Entry */}
                <View style={styles.row}>
                    <View style={styles.entry}>
                        <Text style={styles.label}>Make Entry</Text>
                        <View style={styles.counterContainer}>
                            <Pressable style={styles.counterButton} onPress={decrementEntry}>
                                <Text style={styles.counterText}>-</Text>
                            </Pressable>
                            <Text style={styles.counterValue}>{entryCount}</Text>
                            <Pressable style={styles.counterButton} onPress={incrementEntry}>
                                <Text style={styles.counterText}>+</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Pressable onPress={() => putEntries()} disabled={entryCount === 0}>
                        <Text style={[styles.saveButton, entryCount === 0 && styles.disabledButton]}>Save</Text>
                    </Pressable>
                    <Link href={"/"} asChild>
                        <Pressable>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#d3d3d3",
        paddingHorizontal: 20,
    },
    title: {
        color: "#333",
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: 16,
        elevation: 3,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    infoText: {
        textAlign: "left",
        fontSize: 14,
        color: "#555",
        marginBottom: 2,
        marginLeft: 12,
    },
    icon: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 15,
        marginRight: 15,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: "#6B6B6B",
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: 150,
        borderRadius: 8,
        padding: 5,
    },
    disabledButton: {
        backgroundColor: "#a0a0a0",
        color: "black",
        opacity: .9
    },
    counterButton: {
        borderWidth: 1,
        borderColor: "#007AFF",
        borderRadius: 4,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    counterText: {
        fontSize: 20,
        color: "#007AFF",
        fontWeight: "bold",
    },
    counterValue: {
        fontSize: 48,
        fontWeight: "bold",
        marginHorizontal: 10,
    },
    saveButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: "#FF3B30",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    entry: {
        flexDirection: 'column',
        gap: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    image: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginTop: 50,
    },
});

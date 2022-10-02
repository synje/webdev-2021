import React, { useEffect } from "react"
import { Button } from "react-native-paper";
import { Platform, StyleSheet, View } from "react-native";
import useTgl from "use-tgl";
import AddSong from "./AddSong";
import DBList from "./DBList";

/**
 * Function for toggling between DBList and AddSong view with a button-click
 * @returns A View with updated calues,
 *    XML-rendered elements like buttons and headers,
 *    and either the AddSong-content or the DBList-content
 */
export function ToggleView() {
    const { enabled, on, off, toggle } = useTgl(true);

    useEffect(() => {
        toggle();
    }, [toggle]);

    return enabled ? (
        <>
            <View>
                <View style={styles.toggleContainer}>
                    <Button style={styles.toggleButtonPassive} mode='contained' onPress={off}>See all songs</Button>
                    <Button style={styles.toggleButtonActive} mode='contained' onPress={on}>Add song</Button>
                </View>
                <AddSong />
            </View>
        </>
    ) : (
        <>
            <View>
                <View style={styles.toggleContainer}>
                    <Button style={styles.toggleButtonActive} mode='contained' onPress={off}>See all songs</Button>
                    <Button style={styles.toggleButtonPassive} mode='contained' onPress={on}>Add song</Button>
                </View>
                <DBList />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomColor: "darkgreen",
        borderBottomWidth: 3,
        height: 150,
        shadowColor: Platform.OS === "web" ? "" : '#0c1618',
        shadowOffset: Platform.OS === "web" ? { width: 0, height: 0 } : { width: 3, height: 3 },
        shadowOpacity: Platform.OS === "web" ? 0 : 0.3,
        zIndex: 5,
    },
    toggleButtonActive: {
        width: "30%",
        alignSelf: 'center',
        borderRadius: 0,
        justifyContent: "center",
    },
    toggleButtonPassive: {
        width: "50%",
        alignSelf: 'center',
        borderRadius: 0,
        justifyContent: "center",
        opacity: 0.7,
    }
})
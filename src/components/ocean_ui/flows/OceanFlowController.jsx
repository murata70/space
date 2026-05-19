import { useEffect, useRef, useState } from "react";

import collectionMaster_ocean from "../../../data/collectionMaster_ocean";

import PassingVehicle from "../passing/PassingVehicle";

const publicUrl = process.env.PUBLIC_URL || "";

const COLLECTION_SPAWN_INTERVAL_MS = 15000;
let collectionSpawnIntervalMs = COLLECTION_SPAWN_INTERVAL_MS;
let debugIgnorePassingVehiclesForCollection = false;
let debugSpawnCollectionOnMount = false;
let debugCollectionId = null;
let debugSpawnCollectionsInOrder = false;

// デバッグ用: コレクションを登録順に出現（不要になったら以下5行をコメントアウト）
debugSpawnCollectionsInOrder = true;
collectionSpawnIntervalMs = 800;
debugIgnorePassingVehiclesForCollection = true;
debugSpawnCollectionOnMount = true;
// debugCollectionId = "astronaut2";

const passingImages = [
    `${publicUrl}/assets/ocean_image/passing/passing_car1.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car2.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car3.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car4.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car5.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car6.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car7.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car8.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car9.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car10.png`,
    `${publicUrl}/assets/ocean_image/passing/passing_car11.png`,
];

export default function OceanFlowController() {
    const [passingVehicles, setPassingVehicles] = useState([]);
    const [currentCollectionFlow, setCurrentCollectionFlow] = useState(null);

    const usedCollectionIndexRef = useRef(null);
    const sequentialCollectionIndexRef = useRef(0);

    const vehicleIdRef = useRef(0);

    const lastSpawnTimeRef = useRef(0);

    const collectionRunningRef = useRef(false);

    /*
      一般通過車両の生成ループ
    */
    useEffect(() => {
        const interval = setInterval(() => {
            spawnPassingVehicle();
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    /*
      コレクション（レア演出）の生成ループ
    */
    useEffect(() => {
        if (debugSpawnCollectionOnMount) {
            spawnCollectionFlow();
        }

        const interval = setInterval(() => {
            spawnCollectionFlow();
        }, collectionSpawnIntervalMs);

        return () => clearInterval(interval);
    }, []);

    /*
      一般通過車両を生成する
    */
    const spawnPassingVehicle = () => {
        if (collectionRunningRef.current) return;

        // 同時出現は最大2台まで
        if (passingVehicles.length >= 2) return;

        const now = Date.now();

        // 生成間隔の制限（前回の生成から4秒未満ならスキップ）
        if (now - lastSpawnTimeRef.current < 4000) return;

        lastSpawnTimeRef.current = now;

        const randomIndex = Math.floor(
            Math.random() * passingImages.length
        );

        const image = passingImages[randomIndex];

        const id = vehicleIdRef.current++;

        const newVehicle = {
            id,
            image,
        };

        setPassingVehicles((prev) => [...prev, newVehicle]);
    };

    /*
      一般通過車両の移動完了時処理
    */
    const handleVehicleComplete = (id) => {
        setPassingVehicles((prev) =>
            prev.filter((vehicle) => vehicle.id !== id)
        );
    };

    /*
      コレクション演出を生成する
    */
    const spawnCollectionFlow = () => {
        if (collectionRunningRef.current) return;

        // 一般車両がいる場合は生成しない（ただしデバッグ用無視フラグが立っている場合は除く）
        if (
            !debugIgnorePassingVehiclesForCollection &&
            passingVehicles.length > 0
        ) {
            return;
        }

        if (!collectionMaster_ocean.length) return;

        let nextIndex;

        if (debugSpawnCollectionsInOrder) {
            nextIndex =
                sequentialCollectionIndexRef.current %
                collectionMaster_ocean.length;
            sequentialCollectionIndexRef.current += 1;
        } else if (debugCollectionId) {
            const forcedIndex = collectionMaster_ocean.findIndex(
                (item) => item.id === debugCollectionId
            );
            if (forcedIndex === -1) return;
            nextIndex = forcedIndex;
        } else {
            nextIndex = Math.floor(
                Math.random() * collectionMaster_ocean.length
            );

            // 連続で同じコレクションが出現するのを防止
            if (collectionMaster_ocean.length > 1) {
                while (nextIndex === usedCollectionIndexRef.current) {
                    nextIndex = Math.floor(
                        Math.random() * collectionMaster_ocean.length
                    );
                }
            }
        }

        usedCollectionIndexRef.current = nextIndex;

        const selected = collectionMaster_ocean[nextIndex];

        collectionRunningRef.current = true;

        setCurrentCollectionFlow(() => selected.component);
    };

    /*
      コレクション演出の終了時処理
    */
    const handleCollectionComplete = () => {
        collectionRunningRef.current = false;

        setCurrentCollectionFlow(null);
    };

    const CollectionFlowComponent = currentCollectionFlow;

    // 元のCSSにあった、外枠レイヤー（画面全体を覆う透明な板）としての最低限の定義
    const layerStyle = {
        position: "fixed",
        inset: 0,
        zIndex: 3,
        pointerEvents: "none",
        overflow: "hidden"
    };

    return (
        <div className="ocean-flow-layer" style={layerStyle}>
            {passingVehicles.map((vehicle) => (
                <PassingVehicle
                    key={vehicle.id}
                    image={vehicle.image}
                    onComplete={() => handleVehicleComplete(vehicle.id)}
                />
            ))}

            {CollectionFlowComponent && (
                <CollectionFlowComponent onComplete={handleCollectionComplete} />
            )}
        </div>
    );
}
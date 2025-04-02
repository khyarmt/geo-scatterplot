import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as d3 from "d3";

const initialCenter = [-74.0242, 40.6941];
const initialZoom = 10.12;

function GeoScatterplotContent({ width, height, data }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia2h5YXJtdCIsImEiOiJjbGh5ODIxbWYwcmN3M2xwaWRtb3A1Z25iIn0.aLNbg04hNzdx-664l2P9Yw";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [center[0], center[1]],
      zoom: zoom,
    });

    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (data) {
      mapRef.current.on("load", () => {
        mapRef.current.addSource("companies", {
          type: "geojson",
          data: data,
        });
        mapRef.current.addLayer({
          id: "data",
          type: "circle",
          source: "companies",
          paint: {
            "circle-color": "#C9FFFF",
            "circle-radius": 3,
          },
        });
      });
    }
  });

  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: initialCenter,
      zoom: initialZoom,
    });
  };

  useEffect(() => {
    mapRef.current.resize();
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: width,
        height: height,
      }}
    >
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: width,
          height: height,
        }}
        id="map-container"
        ref={mapContainerRef}
      ></div>
    </div>
  );
}

function GeoScatterplot({ data }) {
  const wrapperRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setSize({
        width: wrapperRef.current.clientWidth,
        height: wrapperRef.current.clientHeight,
      });
    });
    observer.observe(wrapperRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="geo-scatterplot-wrapper">
      <GeoScatterplotContent
        width={size.width}
        height={size.height}
        data={data}
      />
    </div>
  );
}

function App() {
  const [data, setData] = useState();

  const csvToGeoJson = (csvData) => {
    const geoJsonData = {};
    geoJsonData.type = "FeatureCollection";
    const features = csvData.map((item) => {
      return {
        type: "Feature",
        properties: {
          id: item.id,
          name: item.name,
          stateId: item.state_id,
          stateCode: item.state_code,
          countryId: item.country_id,
          countryCode: item.country_code,
          countryName: item.country_name,
          wikiDataId: item.wikiDataId,
        },
        geometry: {
          type: "Point",
          coordinates: [item.longitude, item.latitude],
        },
      };
    });
    geoJsonData.features = features;

    return geoJsonData;
  };

  useEffect(() => {
    (async () => {
      const response = await fetch("data/cities.csv");
      const data = d3.csvParse(await response.text());
      for (const item of data) {
        item.id = Number(item.id);
        item.state_id = Number(item.state_id);
        item.country_id = Number(item.country_id);
        item.latitude = Number(item.latitude);
        item.longitude = Number(item.longitude);
      }
      console.log(data);
      setData(csvToGeoJson(data));
    })();
  }, []);
  console.log(data);

  return <div>{data && <GeoScatterplot data={data} />}</div>;
}

export default App;

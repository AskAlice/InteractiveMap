let Country = function(geoCoords, properties, lineColor, shapeColor) {
    this.geoCoords = geoCoords;
    this.properties = properties;      
    this.lineColor = (!lineColor) ? 0x2d343d : lineColor; 
    this.shapeColor = (!shapeColor) ? 0x2b3039 : shapeColor;           
}
const scale = 100000;
const skew = 0.5;
Country.prototype = {
    createLine: function () {
        if (this.geoCoords !== null) {
        const geometry = new THREE.Geometry();
        for (let P of this.geoCoords.coordinates) {
            if(this.geoCoords.type === "MultiPolygon"){
                P = P[0];
            }

            let p0 = new THREE.Vector3(P[0][0]/scale, P[0][1]/scale, 0);
            for (let i = 1; i < P.length; ++ i) {

                let p1 = new THREE.Vector3(P[i][0]/scale, P[i][1]/scale, 0);
                geometry.vertices.push(p0, p1);
                p0 = p1;

            }
        }
         
        let mat = new THREE.LineBasicMaterial({color: this.lineColor});
        let lineSegments = new THREE.LineSegments(geometry, mat); 
            lineSegments.scale.y = skew;
        lineSegments.rotateX(-Math.PI/2)
        lineSegments.userData = this;
            return lineSegments;
    }
    },
    
    createShape : function() {
        let vecs2 = [];
        let shapearray = [];
        if (this.geoCoords !== null) {
            for (let P of this.geoCoords.coordinates) {
                if (this.geoCoords.type === "MultiPolygon") {
                    P = P[0];
                }
                
                let p0 = new THREE.Vector2(P[0][0]/scale, P[0][1]/scale);
                for (let i = 1; i < P.length; ++i) {

                    let p1 = new THREE.Vector2(P[i][0]/scale, P[i][1]/scale);
                    vecs2.push(p0, p1);
                    p0 = p1;
                }

                shapearray.push(new THREE.Shape(vecs2));
                vecs2 = [];
            }

            let mat = new THREE.MeshBasicMaterial({ color: this.shapeColor });
            let shapeGeo = new THREE.ShapeBufferGeometry(shapearray);
            shapeGeo.scale(1,skew,1);
            shapeGeo.rotateX(-Math.PI / 2);
            let mesh = new THREE.Mesh(shapeGeo, mat);
            mesh.userData = this;
        
            return mesh;
        }
        return;
    }
};
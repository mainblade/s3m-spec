define(function() {
    'use strict';
    return `
        attribute vec4 aPosition;
        attribute vec4 aColor;
        attribute vec4 aTexCoord0;
        uniform float uTexture0Width;
        varying vec4 vTexMatrix;
        varying vec4 vTexCoordTransform;
    #ifdef TexCoord2
        attribute vec4 aTexCoord1;
        uniform float uTexture1Width;
        varying vec4 vTexMatrix2;
    #endif
        varying vec4 vTexCoord;
        varying vec4 vColor;
        const float SHIFT_LEFT8 = 256.0;
        const float SHIFT_RIGHT8 = 1.0 / 256.0;
        const float SHIFT_RIGHT4 = 1.0 / 16.0;
        const float SHIFT_LEFT4 = 16.0;
        void getTextureMatrixFromZValue(in float nZ, inout float XTran, inout float YTran, inout float scale)
        {
            if(nZ <= 0.0)
            {
                return;
            }
            float nDel8 = floor(nZ * SHIFT_RIGHT8);
            float nDel16 = floor(nDel8 * SHIFT_RIGHT8);
            float nDel20 = floor(nDel16 * SHIFT_RIGHT4);
            YTran = nZ - nDel8 * SHIFT_LEFT8;
            XTran = nDel8 - nDel16 * SHIFT_LEFT8;
            float nLevel = nDel16 - nDel20 * SHIFT_LEFT4;
            scale = 1.0 / pow(2.0, nLevel);
        }
        
        void main()
        {
            vTexCoord.xy = aTexCoord0.xy;
        #ifdef TexCoord2
            vTexCoord.zw = aTexCoord1.xy;
        #endif
            vTexMatrix = vec4(0.0,0.0,1.0,0.0);
            vTexCoordTransform.x = aTexCoord0.z;
            if(vTexCoordTransform.x < -90000.0)
            {
                vTexMatrix.z = -1.0;
            }
            getTextureMatrixFromZValue(floor(vTexCoordTransform.x), vTexMatrix.x, vTexMatrix.y, vTexMatrix.z);
            vTexMatrix.w = log2(uTexture0Width * vTexMatrix.z);
        #ifdef TexCoord2
            vTexMatrix2 = vec4(0.0,0.0,1.0,0.0);
            vTexCoordTransform.y = aTexCoord1.z;
            getTextureMatrixFromZValue(floor(vTexCoordTransform.y), vTexMatrix2.x, vTexMatrix2.y, vTexMatrix2.z);
            vTexMatrix2.w = log2(uTexture1Width * vTexMatrix.z);
        #endif
            vColor = aColor;
            gl_Position = czm_modelViewProjection * vec4(aPosition.xyz, 1.0);
        }
    `;
});
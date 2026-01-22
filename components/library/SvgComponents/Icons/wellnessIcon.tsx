interface WellnessIconProps {
  height?: string;
  width?: string;
  fill?: string;
}
export const WellnessIcon = ({
  width = '22',
  height = '24',
  fill = 'black',
}: WellnessIconProps) => {
  // Default fill fallback and convert CSS color string to rgba —
  // For simplicity, we assume fill is hex or named color recognized by browser.

  //
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={width}
      height={height}
      fill='none'
      viewBox="0 0 24 24"
    >
      <rect
        width={width}
        height={height}
        fill='url(#pattern_wellness_icon0_1402_11103)'
      />
      <defs>
        <pattern
          id='pattern_wellness_icon0_1402_11103'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use
            xlinkHref='#image_wellness_icon0_1402_11103'
            transform='scale(0.0078125)'
          />
        </pattern>

        {/* Filter to apply color overlay */}
        <filter id='wellnessColorOverlay' colorInterpolationFilters='sRGB'>
          {/* Flood with fill color */}
          <feFlood floodColor={fill} result='flood' />
          {/* Composite the flood over the source graphic (the image) */}
          <feComposite
            in='flood'
            in2='SourceGraphic'
            operator='in'
            result='mask'
          />
          {/* Blend original image with color overlay */}
          <feBlend in='SourceGraphic' in2='mask' mode='multiply' />
        </filter>
        <image
          id='image_wellness_icon0_1402_11103'
          width='128'
          height='128'
          preserveAspectRatio='none'
          xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAFSVJREFUeJztnXm0XFWVxr/zAoEENIwRQqTDoCAQIEjCPNg0NAp0t92CMiMIbdq2RVtARBBFxQa7RReDzKMIqIRRMJF5khBQBEkICoQkJDEhgYTMyfv5x65niqLqDPeeWxU671vrLVipU3t/+9xb956zzx6cVhEAG0s6RNJ+kraS9EFJ76t9PE/SZEkvSrpP0h3Ouemd4NmLjABWB0YCTwDLicdy4HHg88DqnbajF4kAHHAo8FLCRW+FV4FjANdpu3oRAWAg8FCGC9+IB4ANO21fLzwAtgdeqeDi92Ay8NFO29mLJgD2B96u8OL3YB7wD522txd1ALYC5rTh4vfgLWDbTtudA+/5hQ2wnqQnJW0Z+xVJz9T+Ztf+bX1JO0kapvg5mShpV+fcnHi2vXgHgI9i263C71XgF5G/2lnAKcBgj6zBwKm1sTG4uQTvHYFxwO5FZbxnAawH/IgVe/MHCsrZPfJCXQIMSJC7DnBZhNxuYNeC3MfUybgO+EAROe85AIcDs5tM5kEFZD0SuEDLgZEluH6BsAPpoQJyD2oi5w3gM0W5rvTAflXXeSZyPLBagrwDAhcG4KsZeJ8aoSd6VwD0AZ73yLoFWL8s75UKwMeAqRETeVKCzMsDsm7JyD+0zrg0QdZJEfMwBdgnF/+OombwkgijAWYA74+Q2QVM88hZDGye0YYhwCKPvulAV4SctQO867EMOC2XDW0HsBZwU6Sx9RfugAjZocXfZRXYc0VAZ3AxiL22FifOyY1A/9z2VApgI+CZREPvBT4cKf+UgKzgTVTApo8HdH45Us5WwOjEuRkHDMxtUyUAtgT+nGDcdOBfE3X4tmgLgL4V2LUGsNCj9yeJ8g4F/pIwTy+R8bVWCTDHzowEo26lwAkbcJtH5nNV2FbT+0efLQXkDQzY0ohpwI5V2FYa2MWP9cfPBz5bQtcYj+xHctrVoPdRj94xJeSegD25YvAGK9tNgB3DxrpPJwE7l9R3q0f+s7nsaqL3Dx69vywpewfg5cg5nAlsl8Om4NYlgvg2ksbIDlRC+LWkYc65cSXV/sXzWZUu1Y09n80oI9g596yk4ZJ+EzF8A0ljgK3K6JRK3gDARpLukRSzQr1e0iHOudnBkWH4JnsDoF8GHe8AthVbzzPEd1NGwTn3hqSPS7oyYvhGku6l5BlC4RugNsmjJG0aMfzHko51zi0tqq8BvojdPpJGZNJTj13kn69pOZQ455ZJOlHStyKGD5F0F+32E2CeuJ9Hvq+ye7OAEQGdZ1Sg86yAzuyhYsDpkXN8E+0MWgXOiCT2jYr0r4Y//Gt0BTp/49E3l4SDrES9Z0fOdXvcxsBewNIIQudUzMN3QZZi65Ncuj4QsPneXLpa6P9+xHwvpergEiyQY1IEmasqJaKoR/LJGXV9JaAr+yunCYeYAJXJVHmUDNwRQeI+2pBNA2wb4PF0Rl2/D+jKsicPcOgLPBgx/8keyVgCR0YonwCsWwmB5pyeDvApfaYO7BnQMTaHLZFc1gMmRlyHw3IrXp+wj38hbXZRAicHOJV2CxP+1f1nDlsS+Awl7DaeSc4sJuCGgEKAz2VTGM9rIOFgk/1KyN8/IHsJsEFOmyJ5jYy4HtfmUrZXhLIbsygrxu+aALdxQJ8CclcjHNMQ47GrBIT9MN3AHmWVOGBsQFHex006xy0IPwVOKSD3awGZS4DNqrApkl/Ma/lJyjiIgKMDCgA+ndGuojxDAaKLgeEJ8nYlfFNFB4JWBeCIiOtTLNQci4AJ7fnvzGxTIQCbEo61mwr8XYSszYDXA7I6+uuvB3BXgOvLFImQIhy+vBj4UAU2FQJwboAvwJ/whFVhr5OYcLbvtNM2H4DN8UcsQ2rwDZa8ENpvnl+RTYUA9IvgDBa48mnq3o3YWudwLNomhPHAmp20tRHABQHOE4gIW68X+JmAwNlYVu5KBWA48bWAnqtN3AX4M3XqsRzYqdN2NgJYl/DN+28pAkMetq9VaE9hYMfUcyMvZhHMJeWX1EYQPht5MlbQzgFBbwHrVGxPIQAHZrjIIayU1UEwN3Ho5h/W+L1md/OJAV0XOefezEM7O5L3+yupjmTUQu1CW9MTvJ9iuWu+u2gxK2keO3BYnh94FJISWdoFYBD+uIU5+MLHgGMDhv+8jfZEA6vsEbOCz4XZQEwsZNsBjApwP7J+fOMrILRSzJ50WRbY8fNd8kfsLpd0taSFESIXSLpGUrdnzLqSRrFyroUuD3ze/OmFPf59x4yvsJKtgIEBmL87hKtq4zfAsnBuA17ASr7Nq/3/KOB4aqd7wLURch8nIp29ncB8OK95OM+n2WsAS1b04dwO2NMS2GM/JgN5BgXWLcCGxOXyPwcMqcDEwgB+EOD87qcA/vItALt0wJamAPYmLgm1GziwhJ6DajJCmEbZo9eMAPYI8H13rAD+g58prATFkjFHz+nERSUDXJBB54WRupZidQtWlnnyHWi91viFzQPGXdwhW+o5DgTuibwYAL8kQ6w+VnL+9gS9d9GBKKEmvENRxEPqBx8fGHxo50yRiC8y1YPRwBoZ9fcF7k7QP50KqpQkcg7FChxTP/hqz8BuMiZZJBqxGnAOac0ebqei5FDgzgQey4BvUSAcLRPfTQL8Lq8f/DvPwPEdMuCDwMMJEw5WfbSyrSq2xYrJ0qnHb+lQ8AgW/9AKT9Ub5at9c00HiB9AmmdvIXB8pOwfYBVGmv1FxTgAJwbmrBGz6MAhEv5o7vlAHwFbB8j/d5tJp9QVBHiRhHwE/N1EomsWA8OIC0DpQdvr/gGnBTh9qEtSKK3p+TaR7YNV2rpUUmxq2Y2SdnbO/T5BlW9xGL1wdM79TtLOkm6K/EofSd/HtpXtWheECmYNFeGae5tUzRJb7N2Y8Gt6m4JFpvDvjycXlHkC9kiNxXW04SbAgmV9+GoonmwhFTs2sIt/c8LkPQt8pKCu0IRAwRse2AZ/EalG/JSKagrUcXL4A0b/r0uSz+DXnXNUSVBWOyg2mfESSbs454ruTGLy5wu5dJ1zL8jKyMTmCxwh6Woq/IHVrp2vnM4gAY957pCHqyInScCZkb+W+WRIQCF83gEZdj1YhHFs3b9K4yuxE8tWeFj4V7LZSq43IfbPxDl4ppKQ1ePRN4C49/QCMpzzYy1hfMeyPVgOHFxWn4eHr9T9hC5JvgpTb1VEamvZoz/ktBkvabhz7qkMao+W39Ye9JN0eFlltZ3J7rLmUj50SboBiG16lYq5ns/6d8kMboWYCJokYO+8i7WicXMrTJC0n3Pu9Qw6+0qKquZdwylkOEtwzk2RtLekPwaGDpB0BdWsBxZ4PuvXJcmX5bIoMxlJOk7SxwJjJkraxzmXpfaepM9LSqm0vZnC0dFRcM7NkHUs/1Ng6D6SjgyMKQLfj7ifMA9VK3w7JxMspXlm4J34Zu0VkUvn+0mrYN6DGUDoKZXCYxvCcfszyJxxBXzbo29Zl6Qlnu/nrrv/HVmd21bolnSkc25CRp3nK66UbSMGSjovF4naNvEo+YNNB0rKXV7P53DqFv6mBRfmYoGd7oVSuEtH8DTo3I+4kK5W6CbzuT5wUUDnYjKGnOOPD5zXJWme5/vZHoGSTpP/iTJV0lm5lGFbuavkbwU7paa3FZykS0loOhmBr8tfVzh1wRqCbzG7pEvS254Ba+dgAKwt6ZjAsJOdc74tS4q+Ltk2M/RLOkvhm26IpGvJtEJ3zr0lKVTE8jhgrRz65M+XmBvyBP46BwPCxSaeyKGnTt83AvrASs262t/9EeNPz8wxVHspKr4hQs+9Hh3jwgPykHgwYGxy21iProMJexjnUhcUiZWFmRf4zjLgExl5/ktA332Z9PhS/UeHMmBKZwFjLeR8W82XyRTGhfUtCl1IgH9v8t0vRHxvPgWbRTfR1wW86tG1jAyt4rB0/la4ukvSS57vD6B8NvDB8m9FrnLO+bZGUcBq/9yt8LrlVjXPcbxY0u2B7/aX5QSWjvGr2XyNZ0gfSaWeOMDGknypaxO7FPZVRzVz9CBUqfMXJeULO8MfrXC/oImSjm92xF37t6Nl5w8+bCTr1zOoCNcGhLKt/76k/NC1m9hzauWDv6hAAPjz60qHm2EJI+MDNoC9GraNkLcd/mYUPRhPnkf0ix4dvi1qjOwTAzZs3/MK8AV9FO5MhS20fDkF9xeVXZM/SNJ9kkKu4+WSjnLOhQ5l5Jx7XrZlDb2WtpZ0H+WfBL7F3iDKOYV8TwDUcz6BNRpohYeKagc+GbgD4ytXvVv2R/AvouqRXNEb+FKk7FcpcXZBOCv7n0rI9uVVTKof+CvPwEUUzLTBfxABBdOqsazd2LyBwv584H8jdcyi4BaRcF7mNwvK7Yc/HvDu+sGhwsiFFiP4I31nk+hdA9bEsn9i/ftXpupo0NdFuBp5D7qBH5IYR4A5ot70yL2+IPf9AnxPrR+8a2BwTA+7ZiSe8MhM8v5hv/oJAZ71mE6G0GssX2F6gt7xJD4N8Fc5eawg79DTd4S0IiRrnPyHQvsWISELrGiFl2MEALthXbnuUtqCdJ5zbnnC+KaoyfBF1TRia0l3Y6nssU6jVzyfFfU57Ov5bJ6kZ97xL/jXAcmdMbDHp88D+D3Pd/tjkbW+J0gIi8hwgFOzIyVVrRGPY6V3W8Yj4k84XZpqB1YLycf5Vz1j612wvhDw1SV9KoWEpHXk9wDOqiPchUXMfBbrejVLlvZVxu2aqz5Al+JT1ZphN0k/kzQTK1pxHLaDqZ/7WS2+K0mryWIGU3CY/Jwf7Pmf+orZO0jy5dg95pzbM5YBVkre52V8QNZwebCkofK7LItguXMuR4UQp7BPoAjmynL3psg8mPt6xm7pnPtzrGDgUfkTXHZwzv1BagiWAJ5T62RRJG3hnPO9r+plbS/p2ZixFWGxcy5LWXdgmfxPs6oxtOagCgJrivGKWgfCvOCc+5tHtPEUztf8ySktXr7qCZsnyeekKr0ArIOv6/mD8gfV5EDKXB4pfxTUO7aVzW6AZm7hebK8vNsSiFR1AyAzYiv5Q6tyXhTfDmmqzOV6mfLedPVImcvbJf1EzTkjW4+0BvBI3WpxPFZkILkbKOEW76lYDFxfW6v06PAViizdNLJOjy+/bmzduGFY1m+ZXUMzJKfGAe/DIrHq296Gcz2xlfgNlCx8iO3fc2AK8D0aDl0wD5ov+OOKMvwbdF3t0fOuoBmsQNO5pFU282G3kvz3xG7MLGFmKUqLYjzwP5iHsun7DNs2+nBqs+8VtCXkKm/qoMK2t7sB55HmxWxE9O4rFVUWKFgg6WlZhM7qshzENWVhz2vJ0s5el73HX5dtiZ6SNLbW/CCEkLs1Z3JJSNZBkl5s/Mda1M8Ttb9TsdbuwyWNkO22BtX+NpbNzXxZos4iWUrXUtlaJsUTuWoAfyTvMjKmWGHtWHzlacfk0tWLCGCuTl+WUfbCFrxzcdyIxbVf93sOK1X9/wSMlD/L6G7PZ0Vxj+ezvpJOqkBnLxqBtbQNtXYdWoHeHQI6p1KkRWsv0kC4sHVKzcBU3c8GdIfS33pRBliuf2hvXdlFwHwkPkwjbyJpL+pBuHnDdDKWiW+ifw3CbWR+WJX+KpAcMAFsKMu63VTShrJz9/61/3bJ9q89+9i3ZL7yKZKmOecWFyWKRdc8Kr9f/EznXKWdvbEgzbM9Q5ZL2t05N9YzJqRjDZl/YJPa3wCt8KP0l7RM5i9YIGmx7Fj9NUmTnXMzU3R5bwCsx9w+WnHBh8hfVCqEyZJekDl9XpA0VnY86S1GibmBx8pf1HKGpK2r7mqK+RcmyG7+VpgiaUSoxhHm5dxW5hzaRtL2tf8OLkFxoaRXZTfEa5Iecs79tJAk4JLA4y4HZmIt206miUsViwT+bYSco0pMWuq8HBfBZxxNwumx6uxfxlrXzSo0Y2m4pIyhsckROfECdvizM3bxY/r13E8bmzVhB1G+svM9GFWzYQR2OBSTwpYb/+WzJfQKOEBSliIRBTFfdm7gwxJZiFNO338QWJ7hMwoX0lqguAKVVeEA51xLV3XIE9jWSW2CmDIpX2z3xZekWp5hqNSL1NmLLwWynUNPACcLXsxSK6gCXOic+2InCWAt9UZ2koMHcyWt41tke58AtS92+inQCm/IqoB1GldKijm+7gTGh3ZYMfEAD8tao7TCpyTd45xbIFlSolbsVzeS7WcHyzJchsq2OTnq4K0vaRxW3v3MHDWFU4AVpThH0rHKd6g2SbY9fl4W2TtFK2ImFkpa6JxbVNPfX1Z95WaPvPKnosCBgVXmdQVkrgscApyP5cX5Mohi8BYwkjbsBLAon//AX3snBsuw7e15WGGr5BL1hNvs7J/D4H4BYxdRskgCVuXjc1jbVV9KcwgP0yI8KwewjJ5HS/BbiDWfPAHzqJbhMhh/8OkccrnFgasChmXzf2MFpb+EtWUvggVA9rN57AmT0iuwHs/VbMoZpfSjgM5mhbAKK9s7oGwxsEU2hSv07ok5gorU+/0ZUDrdDOs0cksB/d017tnbygMfJhx6HtMfKUnpUwGFY6joHQxsi4Wqp/QQBniJiMJQHr3b4W+/2gzLsd5E2+ScgzpODnggwCFr5dUexaFaNhBwO2bgMAwr8ZqCNymwGMIWv6kLvdHUJa5UAeArETw+WYViR7i+7RIqjGGv43IwMCnhwiwlYV2ArfJ9UcCNeIWMZWQ9vPaN4PU4Ve2GgL0Iv4/foMRjN4HL2sCPSXstnBEh95sJ8pZjjTcr95QCQ7G6Sj50UzKLKIbIZRETMw1LD68c2E3pK3PXiJb1joDvJsiZRAULvBa8diSuTtFF7SDzfuLq880B/rFyQvrb1vHOhIv3rvI0WCpaLO6gTXkAwCfwVxHrwcu04UnUQ2o4cXviZcDZQJkSK7GcHPB14reMp9R9N5T714Nu4HTa43HsC5xD3CtuAbBT1ZwaCYbCs+vxDLn3pa15HUpc29Zu4AjgaOJumgVAap2kojbsRTgEvd6Oo9vBqxnRmM4c9URHkanefoDXrsRVEl1K3Gp/JrW6ehXz3g0LFUtBpb2HY0j7Spy1wjjMNVq67r6H1w74O6LFYgYVZBrV8dwci4f0dfZohe+W1e+AszPYsYesL0CRd+McWej407Jo1pwYKKv8XbQB09uSrpOUFGodgSGyI/ZBkpKrr8hKvYyRpZ2XggO8AQO9+P+N92p2cC8yofcGWMXRewOs4ui9AVZx9N4Aqzh6b4BVHH8FuBd6irCa8woAAAAASUVORK5CYII='
          filter='url(#wellnessColorOverlay)'
        />
      </defs>
    </svg>
  );
};

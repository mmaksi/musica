import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  }),
  actions: {
    async newSong(song) {
      // Destroy the sound instance if there is a song already playing to avoid memory leaks
      if (this.sound instanceof Howl) {
        this.sound.unload()
      }
      // If there is no song playing, play the specified song
      this.currentSong = song
      this.sound = new Howl({
        src: [song.url],
        html5: true
      })
      this.sound.play()
      // Then update the (seek, duration and playerProgress) properties while playing the song
      this.sound.on('play', () => {
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      // Check if sound is a plain javascript onject or a Howl object
      if (!this.sound.playing) {
        return
      }
      // Toggle auido state: playing/paused
      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    progress() {
      this.seek = helper.formatTime(this.sound.seek())
      this.duration = helper.formatTime(this.sound.duration())

      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    }
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }
      return false
    }
  }
})
